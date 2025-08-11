-- Location: supabase/migrations/20250811185026_subscription_management.sql
-- Schema Analysis: Existing user_profiles, pets, nfc_tags tables detected
-- Integration Type: NEW_MODULE - Adding subscription management to existing pet tracking platform
-- Dependencies: user_profiles (existing), pets (existing), nfc_tags (existing)

-- Create subscription plan enum
CREATE TYPE public.subscription_plan AS ENUM ('monthly', 'annual');
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'pending', 'expired', 'failed');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create subscription plans table (static data)
CREATE TABLE public.subscription_plan_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_type public.subscription_plan NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ARS',
    billing_cycle_days INTEGER NOT NULL,
    mercadopago_plan_id TEXT NOT NULL UNIQUE,
    mercadopago_checkout_url TEXT NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plan_configs(id) ON DELETE CASCADE,
    status public.subscription_status DEFAULT 'pending'::public.subscription_status,
    started_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    mercadopago_preapproval_id TEXT,
    auto_renewal BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create payment history table
CREATE TABLE public.subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ARS',
    status public.payment_status DEFAULT 'pending'::public.payment_status,
    mercadopago_payment_id TEXT,
    payment_date TIMESTAMPTZ,
    billing_period_start TIMESTAMPTZ,
    billing_period_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expires_at ON public.user_subscriptions(expires_at);
CREATE INDEX idx_subscription_payments_subscription_id ON public.subscription_payments(subscription_id);
CREATE INDEX idx_subscription_payments_user_id ON public.subscription_payments(user_id);
CREATE INDEX idx_subscription_payments_status ON public.subscription_payments(status);
CREATE INDEX idx_subscription_plan_configs_plan_type ON public.subscription_plan_configs(plan_type);

-- Enable RLS
ALTER TABLE public.subscription_plan_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies using Pattern 4: Public Read, Private Write for plan configs
CREATE POLICY "public_can_read_subscription_plans"
ON public.subscription_plan_configs
FOR SELECT
TO public
USING (true);

-- RLS Policies using Pattern 2: Simple User Ownership for user subscriptions
CREATE POLICY "users_manage_own_subscriptions"
ON public.user_subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies using Pattern 2: Simple User Ownership for payments
CREATE POLICY "users_manage_own_payments"
ON public.subscription_payments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plan_configs_updated_at
    BEFORE UPDATE ON public.subscription_plan_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_payments_updated_at
    BEFORE UPDATE ON public.subscription_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert subscription plan configurations
DO $$
BEGIN
    INSERT INTO public.subscription_plan_configs (
        plan_type, 
        name, 
        description, 
        price_amount, 
        billing_cycle_days, 
        mercadopago_plan_id,
        mercadopago_checkout_url,
        features
    ) VALUES
        (
            'monthly'::public.subscription_plan,
            'Plan Mensual',
            'Acceso completo con facturación mensual. Mascotas y placas NFC ilimitadas.',
            29.99,
            30,
            'e5522a9e681e4f9d952434f2d1d5ee6a',
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=e5522a9e681e4f9d952434f2d1d5ee6a',
            '[
                "Mascotas ilimitadas",
                "Placas NFC ilimitadas",
                "Seguimiento GPS en tiempo real",
                "Historial completo de escaneos",
                "Alertas de ubicación",
                "Soporte prioritario",
                "Análiticas avanzadas",
                "Respaldo automático de datos"
            ]'::jsonb
        ),
        (
            'annual'::public.subscription_plan,
            'Plan Anual',
            'Acceso completo con facturación anual. Mascotas y placas NFC ilimitadas. Ahorra 2 meses.',
            299.99,
            365,
            '91b45ef521144412bee453f0787c14b7',
            'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=91b45ef521144412bee453f0787c14b7',
            '[
                "Mascotas ilimitadas",
                "Placas NFC ilimitadas",
                "Seguimiento GPS en tiempo real",
                "Historial completo de escaneos",
                "Alertas de ubicación",
                "Soporte prioritario",
                "Análiticas avanzadas",
                "Respaldo automático de datos",
                "Ahorra 2 meses al año",
                "Acceso anticipado a nuevas funciones"
            ]'::jsonb
        );
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Subscription plans already exist, skipping insertion';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting subscription plans: %', SQLERRM;
END $$;

-- Create helper function to get user's active subscription
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(user_uuid UUID)
RETURNS TABLE(
    subscription_id UUID,
    plan_name TEXT,
    plan_type TEXT,
    status TEXT,
    expires_at TIMESTAMPTZ,
    features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        us.id,
        spc.name,
        us.plan_type::TEXT,
        us.status::TEXT,
        us.expires_at,
        spc.features
    FROM public.user_subscriptions us
    JOIN public.subscription_plan_configs spc ON us.plan_id = spc.id
    WHERE us.user_id = user_uuid 
    AND us.status = 'active'::public.subscription_status
    AND (us.expires_at IS NULL OR us.expires_at > CURRENT_TIMESTAMP)
    ORDER BY us.created_at DESC
    LIMIT 1;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error getting user active subscription: %', SQLERRM;
        RETURN;
END;
$$;

-- Create function to check if user has unlimited access
CREATE OR REPLACE FUNCTION public.user_has_unlimited_access(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_active_subscription BOOLEAN := false;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.user_subscriptions us
        WHERE us.user_id = user_uuid
        AND us.status = 'active'::public.subscription_status
        AND (us.expires_at IS NULL OR us.expires_at > CURRENT_TIMESTAMP)
    ) INTO has_active_subscription;

    RETURN has_active_subscription;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error checking user unlimited access: %', SQLERRM;
        RETURN false;
END;
$$;
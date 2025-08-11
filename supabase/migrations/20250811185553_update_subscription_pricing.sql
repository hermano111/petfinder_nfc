-- Location: supabase/migrations/20250811185553_update_subscription_pricing.sql
-- Schema Analysis: Subscription system already exists with subscription_plan_configs table
-- Integration Type: Data update for existing pricing structure
-- Dependencies: subscription_plan_configs table with current pricing data

-- Update subscription plan pricing to new rates
-- Monthly: $29.99 → $2000 ARS
-- Annual: $299.99 → $20000 ARS
-- Add 7-day free trial information

UPDATE public.subscription_plan_configs
SET 
    price_amount = 2000.00,
    description = 'Acceso completo con facturación mensual. Mascotas ilimitadas, placas NFC ilimitadas, seguimiento GPS, historial de escaneos, alertas de ubicación, soporte prioritario, analíticas avanzadas y respaldo automático. Incluye 7 días de prueba gratuita.',
    features = jsonb_build_array(
        'Mascotas ilimitadas',
        'Placas NFC ilimitadas', 
        'Seguimiento GPS avanzado',
        'Historial completo de escaneos',
        'Alertas de ubicación en tiempo real',
        'Notificaciones WhatsApp ilimitadas',
        'Historial médico completo',
        'Contactos de emergencia múltiples',
        'Soporte prioritario 24/7',
        'Analíticas y reportes avanzados',
        'Respaldo automático de datos',
        '7 días de prueba gratuita'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE plan_type = 'monthly';

UPDATE public.subscription_plan_configs
SET 
    price_amount = 20000.00,
    description = 'Acceso completo con facturación anual. Mascotas ilimitadas, placas NFC ilimitadas, seguimiento GPS, historial de escaneos, alertas de ubicación, soporte prioritario, analíticas avanzadas y respaldo automático. Incluye 7 días de prueba gratuita. Ahorra más de $4000 al año.',
    features = jsonb_build_array(
        'Mascotas ilimitadas',
        'Placas NFC ilimitadas',
        'Seguimiento GPS avanzado', 
        'Historial completo de escaneos',
        'Alertas de ubicación en tiempo real',
        'Notificaciones WhatsApp ilimitadas',
        'Historial médico completo',
        'Contactos de emergencia múltiples',
        'Soporte prioritario 24/7',
        'Analíticas y reportes avanzados',
        'Respaldo automático de datos',
        'API para integración empresarial',
        'Dashboard administrativo avanzado',
        '7 días de prueba gratuita',
        'Ahorra $4000+ por año vs. plan mensual'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE plan_type = 'annual';

-- Add comment explaining the pricing update
COMMENT ON TABLE public.subscription_plan_configs IS 'Subscription plan configurations with updated 2025 pricing: Monthly $2000, Annual $20000, includes 7-day free trial for all plans';
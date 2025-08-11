import { supabase } from '../lib/supabase';

export const subscriptionService = {
  // Get all available subscription plans
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase?.from('subscription_plan_configs')?.select('*')?.eq('is_active', true)?.order('plan_type');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get user's active subscription
  async getUserActiveSubscription(userId) {
    try {
      const { data, error } = await supabase?.rpc('get_user_active_subscription', { user_uuid: userId });

      if (error) throw error;
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Check if user has unlimited access
  async checkUnlimitedAccess(userId) {
    try {
      const { data, error } = await supabase?.rpc('user_has_unlimited_access', { user_uuid: userId });

      if (error) throw error;
      return { hasAccess: data, error: null };
    } catch (error) {
      return { hasAccess: false, error: error?.message };
    }
  },

  // Get user's subscription history
  async getUserSubscriptionHistory(userId) {
    try {
      const { data, error } = await supabase?.from('user_subscriptions')?.select(`
          *,
          subscription_plan_configs!inner(name, plan_type, price_amount, currency)
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Create subscription record after MercadoPago payment
  async createSubscription(subscriptionData) {
    try {
      const { data, error } = await supabase?.from('user_subscriptions')?.insert([subscriptionData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update subscription status
  async updateSubscriptionStatus(subscriptionId, status, metadata = {}) {
    try {
      const { data, error } = await supabase?.from('user_subscriptions')?.update({ 
          status,
          updated_at: new Date()?.toISOString(),
          ...metadata
        })?.eq('id', subscriptionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Record payment
  async recordPayment(paymentData) {
    try {
      const { data, error } = await supabase?.from('subscription_payments')?.insert([paymentData])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get payment history
  async getPaymentHistory(userId) {
    try {
      const { data, error } = await supabase?.from('subscription_payments')?.select(`
          *,
          user_subscriptions!inner(
            subscription_plan_configs!inner(name, plan_type)
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const { data, error } = await supabase?.from('user_subscriptions')?.update({ 
          status: 'canceled',
          auto_renewal: false,
          updated_at: new Date()?.toISOString()
        })?.eq('id', subscriptionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }
};
import { supabase } from '../lib/supabase';

export const emergencyContactService = {
  // Get emergency contacts for a pet
  async getPetEmergencyContacts(petId) {
    try {
      const { data, error } = await supabase?.from('emergency_contacts')?.select('*')?.eq('pet_id', petId)?.order('is_primary', { ascending: false })?.order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Add emergency contact
  async addEmergencyContact(petId, contactData) {
    try {
      // If this is being set as primary, unset others first
      if (contactData?.is_primary) {
        await supabase?.from('emergency_contacts')?.update({ is_primary: false })?.eq('pet_id', petId)
      }

      const { data, error } = await supabase?.from('emergency_contacts')?.insert({ ...contactData, pet_id: petId })?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Update emergency contact
  async updateEmergencyContact(contactId, updates) {
    try {
      // If setting as primary, unset others first
      if (updates?.is_primary) {
        // Get pet_id first
        const { data: contact } = await supabase?.from('emergency_contacts')?.select('pet_id')?.eq('id', contactId)?.single()

        if (contact) {
          await supabase?.from('emergency_contacts')?.update({ is_primary: false })?.eq('pet_id', contact?.pet_id)
        }
      }

      const { data, error } = await supabase?.from('emergency_contacts')?.update(updates)?.eq('id', contactId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Delete emergency contact
  async deleteEmergencyContact(contactId) {
    try {
      const { error } = await supabase?.from('emergency_contacts')?.delete()?.eq('id', contactId)

      if (error) throw error
      return true
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Set primary emergency contact
  async setPrimaryContact(contactId) {
    try {
      // Get pet_id first
      const { data: contact, error: fetchError } = await supabase?.from('emergency_contacts')?.select('pet_id')?.eq('id', contactId)?.single()

      if (fetchError) throw fetchError

      // Unset all primary contacts for this pet
      await supabase?.from('emergency_contacts')?.update({ is_primary: false })?.eq('pet_id', contact?.pet_id)

      // Set the selected contact as primary
      const { data, error } = await supabase?.from('emergency_contacts')?.update({ is_primary: true })?.eq('id', contactId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get primary emergency contact for a pet
  async getPrimaryContact(petId) {
    try {
      const { data, error } = await supabase?.from('emergency_contacts')?.select('*')?.eq('pet_id', petId)?.eq('is_primary', true)?.single()

      if (error && error?.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  }
}
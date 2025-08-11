import { supabase } from '../lib/supabase';

export const medicalService = {
  // Get medical records for a pet
  async getPetMedicalRecords(petId) {
    try {
      const { data, error } = await supabase?.from('pet_medical_records')?.select('*')?.eq('pet_id', petId)?.order('date_performed', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Add medical record
  async addMedicalRecord(petId, recordData) {
    try {
      const { data, error } = await supabase?.from('pet_medical_records')?.insert({ ...recordData, pet_id: petId })?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Update medical record
  async updateMedicalRecord(recordId, updates) {
    try {
      const { data, error } = await supabase?.from('pet_medical_records')?.update(updates)?.eq('id', recordId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Delete medical record
  async deleteMedicalRecord(recordId) {
    try {
      const { error } = await supabase?.from('pet_medical_records')?.delete()?.eq('id', recordId)

      if (error) throw error
      return true
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get upcoming medical appointments/treatments
  async getUpcomingMedical(petId) {
    try {
      const { data, error } = await supabase?.from('pet_medical_records')?.select('*')?.eq('pet_id', petId)?.gte('next_due_date', new Date()?.toISOString()?.split('T')?.[0])?.order('next_due_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get medical records by type
  async getMedicalRecordsByType(petId, recordType) {
    try {
      const { data, error } = await supabase?.from('pet_medical_records')?.select('*')?.eq('pet_id', petId)?.eq('record_type', recordType)?.order('date_performed', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  }
}
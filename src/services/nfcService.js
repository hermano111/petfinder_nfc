import { supabase } from '../lib/supabase';

export const nfcService = {
  // Get NFC tag by identifier (PUBLIC ACCESS) - FIXED METHOD
  async getNFCTagByIdentifier(tagIdentifier) {
    try {
      console.log('🔍 Looking up NFC tag:', tagIdentifier);

      const { data, error } = await supabase?.from('nfc_tags')?.select(`
          *,
          pets(
            id,
            name,
            pet_type,
            breed,
            size,
            color,
            age_years,
            age_months,
            distinctive_marks,
            personality_description,
            special_needs,
            reward_amount,
            is_lost,
            owner_id,
            pet_photos(*),
            emergency_contacts(*)
          )
        `)?.eq('tag_identifier', tagIdentifier)?.eq('is_active', true)?.single();

      if (error) {
        console.error('❌ Supabase error looking up NFC tag:', error);
        if (error?.code === 'PGRST116') {
          throw new Error(`La placa NFC "${tagIdentifier}" no está registrada o está inactiva.`);
        }
        throw error;
      }

      console.log('✅ NFC tag data found:', data);

      if (!data || !data?.pets) {
        throw new Error(`La placa NFC "${tagIdentifier}" no está vinculada a ninguna mascota.`);
      }

      // Get owner information separately for public access
      if (data?.pets && data?.pets?.owner_id) {
        try {
          console.log('🔍 Fetching owner data for:', data?.pets?.owner_id);
          const { data: ownerData, error: ownerError } = await supabase?.from('user_profiles')?.select('full_name, phone_number, whatsapp_number')?.eq('id', data?.pets?.owner_id)?.single();

          if (ownerData && !ownerError) {
            console.log('✅ Owner data found:', ownerData);
            data.pets.user_profiles = ownerData;
          } else {
            console.warn('⚠️ Could not fetch owner data:', ownerError);
          }
        } catch (ownerErr) {
          console.warn('⚠️ Owner data fetch error:', ownerErr);
        }
      }

      console.log('🎉 Complete pet data with owner:', data);
      return data;
    } catch (error) {
      console.error('💥 Error in getNFCTagByIdentifier:', error);
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.');
      }
      throw error;
    }
  },

  // Get NFC tags for a pet
  async getPetNFCTags(petId) {
    try {
      console.log('🔍 Loading NFC tags for pet:', petId);
      const { data, error } = await supabase?.from('nfc_tags')?.select('*')?.eq('pet_id', petId)?.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading NFC tags:', error);
        throw error;
      }
      
      console.log(`✅ Found ${data ? data?.length : 0} NFC tags for pet`);
      return data || [];
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Create NFC tag with improved error handling for existing tags
  async createNFCTag(petId, tagData) {
    try {
      console.log('🔧 Creating NFC tag for pet:', petId, tagData);
      
      // Check if tag identifier already exists
      if (tagData && tagData?.tag_identifier) {
        const { data: existingTag, error: checkError } = await supabase?.from('nfc_tags')?.select('id, pet_id')?.eq('tag_identifier', tagData?.tag_identifier)?.single();

        if (checkError && checkError?.code !== 'PGRST116') {
          // PGRST116 is "not found" which is what we want
          throw checkError;
        }

        if (existingTag) {
          throw new Error(`El identificador de placa "${tagData.tag_identifier}" ya está en uso. Genera uno nuevo o usa uno diferente.`);
        }
      }

      const { data, error } = await supabase?.from('nfc_tags')?.insert({ 
          ...tagData, 
          pet_id: petId,
          activated_at: new Date()?.toISOString()
        })?.select()?.single();

      if (error) {
        console.error('❌ Error creating NFC tag:', error);
        if (error?.code === '23505') {
          throw new Error(`El identificador de placa ya está en uso. Por favor, genera uno nuevo.`);
        }
        throw error;
      }
      
      console.log('✅ NFC tag created successfully:', data);
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Update NFC tag
  async updateNFCTag(tagId, updates) {
    try {
      console.log('🔧 Updating NFC tag:', tagId, updates);
      const { data, error } = await supabase?.from('nfc_tags')?.update(updates)?.eq('id', tagId)?.select()?.single();

      if (error) {
        console.error('❌ Error updating NFC tag:', error);
        throw error;
      }
      
      console.log('✅ NFC tag updated successfully:', data);
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Activate NFC tag
  async activateNFCTag(tagId) {
    try {
      const { data, error } = await supabase?.from('nfc_tags')?.update({ 
          is_active: true, 
          activated_at: new Date()?.toISOString() 
        })?.eq('id', tagId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Deactivate NFC tag
  async deactivateNFCTag(tagId) {
    try {
      const { data, error } = await supabase?.from('nfc_tags')?.update({ is_active: false })?.eq('id', tagId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Mark tag as lost
  async markTagAsLost(tagId, isLost = true) {
    try {
      const { data, error } = await supabase?.from('nfc_tags')?.update({ is_lost: isLost })?.eq('id', tagId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Mark tag as stolen
  async markTagAsStolen(tagId, isStolen = true) {
    try {
      const { data, error } = await supabase?.from('nfc_tags')?.update({ is_stolen: isStolen })?.eq('id', tagId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Delete NFC tag
  async deleteNFCTag(tagId) {
    try {
      const { error } = await supabase?.from('nfc_tags')?.delete()?.eq('id', tagId);

      if (error) throw error;
      return true;
    } catch (error) {
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Generate unique tag identifier - Enhanced version
  generateTagIdentifier(petName, petId = null) {
    const timestamp = Date.now()?.toString()?.slice(-6);
    const petPrefix = petName ? petName?.substring(0, 6)?.toUpperCase()?.replace(/[^A-Z]/g, '') : 'PET';
    const petIdSuffix = petId ? petId?.toString()?.slice(-4) : Math.random()?.toString(36)?.substr(2, 4)?.toUpperCase();
    return `PETTAG${timestamp}${petPrefix}${petIdSuffix}`;
  }
};
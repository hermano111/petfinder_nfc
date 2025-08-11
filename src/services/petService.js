import { supabase } from '../lib/supabase';
import { webhookService } from './webhookService';

export const petService = {
  // Get all pets for the authenticated user
  async getUserPets(userId) {
    try {
      const { data, error } = await supabase?.from('pets')?.select(`
          *,
          pet_photos(*),
          nfc_tags(*),
          emergency_contacts(*),
          notification_preferences(*)
        `)?.eq('owner_id', userId)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get pet by ID with all related data
  async getPetById(petId) {
    try {
      const { data, error } = await supabase?.from('pets')?.select(`
          *,
          pet_photos(*),
          pet_medical_records(*),
          emergency_contacts(*),
          nfc_tags(*),
          notification_preferences(*),
          user_profiles(full_name, email, phone_number, whatsapp_number)
        `)?.eq('id', petId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get pet by NFC tag identifier (for public access) - REMOVED DUPLICATE, USE nfcService instead
  // This method was causing confusion - use nfcService.getNFCTagByIdentifier() instead

  // Create new pet - Enhanced with automatic NFC tag creation
  async createPet(petData, userId) {
    try {
      console.log('🔧 Creating pet with data:', { ...petData, owner_id: userId });
      
      const { data, error } = await supabase
        ?.from('pets')
        ?.insert({ ...petData, owner_id: userId })
        ?.select()
        ?.single();

      if (error) {
        console.error('❌ Supabase error creating pet:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from pet creation');
      }
      
      console.log('✅ Pet created successfully:', data);

      // Automatically create a default NFC tag for the new pet
      try {
        const tagIdentifier = this.generateDefaultTagIdentifier(data?.name, data?.id);
        
        console.log('🔧 Creating default NFC tag with identifier:', tagIdentifier);
        
        const { data: tagData, error: tagError } = await supabase
          ?.from('nfc_tags')
          ?.insert({
            pet_id: data?.id,
            tag_identifier: tagIdentifier,
            is_active: true,
            activated_at: new Date()?.toISOString()
          })
          ?.select()
          ?.single();

        if (tagError) {
          console.warn('⚠️ Failed to create default NFC tag:', tagError);
          // Don't throw error - pet creation succeeded, tag creation is secondary
        } else {
          console.log('✅ Default NFC tag created successfully:', tagData);
        }
      } catch (tagError) {
        console.warn('⚠️ Error creating default NFC tag:', tagError);
        // Continue without throwing - pet creation was successful
      }
      
      return data;
    } catch (error) {
      console.error('💥 Error in createPet:', error);
      
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      
      if (error?.code === '23505') {
        if (error?.message?.includes('microchip_number')) {
          throw new Error('El número de microchip ya está registrado. Usa un número diferente o déjalo vacío.');
        }
        throw new Error('Ya existe una mascota con esta información.');
      }
      
      if (error?.code === '23503') {
        throw new Error('Error de referencia en la base de datos. Verifica tu sesión de usuario.');
      }
      
      if (error?.code === 'RLS_VIOLATION' || error?.message?.includes('RLS')) {
        throw new Error('No tienes permisos para crear mascotas. Inicia sesión nuevamente.');
      }
      
      throw error;
    }
  },

  // Update pet information
  async updatePet(petId, updates) {
    try {
      const { data, error } = await supabase?.from('pets')?.update(updates)?.eq('id', petId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Delete pet
  async deletePet(petId) {
    try {
      const { error } = await supabase?.from('pets')?.delete()?.eq('id', petId)

      if (error) throw error
      return true
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Upload pet photo
  async uploadPetPhoto(petId, file, isPrivate = false) {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${petId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('pet-photos')?.upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase?.storage?.from('pet-photos')?.getPublicUrl(fileName)

      // Save photo record
      const { data, error } = await supabase?.from('pet_photos')?.insert({
          pet_id: petId,
          photo_url: publicUrl,
          storage_path: fileName
        })?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to storage service. Please check your connection.')
      }
      throw error
    }
  },

  // Delete pet photo
  async deletePetPhoto(photoId) {
    try {
      // First get photo info
      const { data: photo, error: fetchError } = await supabase?.from('pet_photos')?.select('storage_path')?.eq('id', photoId)?.single()

      if (fetchError) throw fetchError

      // Delete from storage
      if (photo?.storage_path) {
        const { error: storageError } = await supabase?.storage?.from('pet-photos')?.remove([photo?.storage_path])
        
        if (storageError) console.error('Storage deletion failed:', storageError)
      }

      // Delete record
      const { error } = await supabase?.from('pet_photos')?.delete()?.eq('id', photoId)

      if (error) throw error
      return true
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Set primary photo
  async setPrimaryPhoto(petId, photoId) {
    try {
      // First unset all primary photos for this pet
      await supabase?.from('pet_photos')?.update({ is_primary: false })?.eq('pet_id', petId)

      // Set the selected photo as primary
      const { data, error } = await supabase?.from('pet_photos')?.update({ is_primary: true })?.eq('id', photoId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Record pet scan (for webhook/public access) - ENHANCED WITH AUTOMATIC WEBHOOK
  async recordPetScan(scanData) {
    try {
      const { data, error } = await supabase?.rpc('process_pet_scan_webhook', {
        tag_identifier: scanData?.tagIdentifier,
        scan_latitude: scanData?.latitude,
        scan_longitude: scanData?.longitude,
        device_info: scanData?.deviceInfo,
        finder_message: scanData?.finderMessage
      })

      if (error) throw error

      const result = data?.[0] || { success: false, message: 'No response from webhook function' }

      // If scan was recorded successfully and we have webhook data, send the webhook
      if (result?.success && result?.webhook_data) {
        try {
          const webhookResult = await webhookService?.sendPetScanWebhook(result?.webhook_data);
          
          // Update the scan record with webhook response
          if (result?.webhook_data?.scan_id) {
            await supabase?.from('pet_scans')
              ?.update({ 
                webhook_response: {
                  webhook_sent: webhookResult?.success,
                  webhook_message: webhookResult?.message,
                  webhook_timestamp: new Date()?.toISOString(),
                  webhook_status: webhookResult?.status
                },
                notification_sent: webhookResult?.success 
              })
              ?.eq('id', result?.webhook_data?.scan_id);
          }

          // Return combined result
          return {
            ...result,
            webhook_sent: webhookResult?.success,
            webhook_message: webhookResult?.message
          };
        } catch (webhookError) {
          // If webhook fails, still return the scan success but note webhook failure
          return {
            ...result,
            webhook_sent: false,
            webhook_message: `Scan recorded but webhook failed: ${webhookError?.message}`
          };
        }
      }

      return result;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Record pet scan with automatic webhook (separate method for automatic triggers)
  async recordAutomaticPetScan(tagIdentifier, location = null, deviceInfo = null) {
    try {
      console.log('🚀 Recording automatic pet scan for tag:', tagIdentifier);
      
      const scanData = {
        tagIdentifier,
        latitude: location ? location?.latitude : null,
        longitude: location ? location?.longitude : null,
        deviceInfo: deviceInfo || {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date()?.toISOString(),
          automatic: true
        },
        finderMessage: 'Escaneo automático del chip NFC - Alguien ha visto a tu mascota'
      };

      const result = await this.recordPetScan(scanData);
      console.log('✅ Automatic scan recorded:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in recordAutomaticPetScan:', error);
      if (error?.message && error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.');
      }
      throw error;
    }
  },

  // Get scan history for a pet
  async getPetScanHistory(petId) {
    try {
      const { data, error } = await supabase?.from('pet_scans')?.select('*')?.eq('pet_id', petId)?.order('scan_timestamp', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get today's scans for user's pets
  async getTodayScans(userId) {
    try {
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      const todayStart = today?.toISOString();
      
      const tomorrow = new Date(today);
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      const todayEnd = tomorrow?.toISOString();

      const { data, error } = await supabase?.from('pet_scans')?.select(`
          *,
          pets!inner(owner_id)
        `)?.eq('pets.owner_id', userId)?.gte('scan_timestamp', todayStart)?.lt('scan_timestamp', todayEnd)?.order('scan_timestamp', { ascending: false });

      if (error) throw error
      return data || []
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Get active alerts count for user's pets
  async getActiveAlerts(userId) {
    try {
      // Count lost pets + tags that are lost/stolen
      const { data: lostPets, error: petsError } = await supabase?.from('pets')?.select('id')?.eq('owner_id', userId)?.eq('is_lost', true);

      if (petsError) throw petsError;

      const { data: problemTags, error: tagsError } = await supabase?.from('nfc_tags')?.select(`
          id,
          pets!inner(owner_id)
        `)?.eq('pets.owner_id', userId)?.or('is_lost.eq.true,is_stolen.eq.true');

      if (tagsError) throw tagsError;

      const alertCount = (lostPets?.length || 0) + (problemTags?.length || 0);
      return alertCount;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        throw new Error('Cannot connect to database. Please check your connection.')
      }
      throw error
    }
  },

  // Generate default NFC tag identifier for new pets
  generateDefaultTagIdentifier(petName, petId) {
    const timestamp = Date.now()?.toString()?.slice(-6);
    const petPrefix = petName ? petName?.substring(0, 6)?.toUpperCase()?.replace(/[^A-Z]/g, '') : 'PET';
    const petIdSuffix = petId ? petId?.toString()?.slice(-4) : '0000';
    return `PETTAG${timestamp}${petPrefix}${petIdSuffix}`;
  }
}
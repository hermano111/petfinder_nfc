import axios from 'axios';

export const webhookService = {
  // Send webhook notification for pet scan
  async sendPetScanWebhook(webhookData) {
    try {
      const webhookUrl = 'https://jautomations.jautomations.space/webhook/scan';
      
      // Get client IP address (best effort)
      const getClientIP = () => {
        // Try to get IP from various sources
        // Note: This won't work perfectly in browser due to privacy restrictions // But we'll include what we can detect
        const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
        return {
          userAgent: navigator?.userAgent,
          platform: navigator?.platform,
          language: navigator?.language,
          timezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone,
          connectionType: connection?.effectiveType,
          // Note: Actual IP will need to be determined server-side or via external service
          clientInfo: 'Browser client - IP determined server-side'
        };
      };

      // Prepare the RAW DATA payload for n8n (no message template)
      const payload = {
        // Raw data only - no formatted messages
        tag_identifier: webhookData?.tag_identifier,
        pet_name: webhookData?.pet_name,
        owner_whatsapp: webhookData?.owner_whatsapp,
        
        // Time data
        scan_timestamp: webhookData?.scan_timestamp,
        formatted_time: new Date(webhookData?.scan_timestamp)?.toLocaleString('es-ES', {
          timeZone: 'Europe/Madrid',
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        
        // Location data
        location: {
          latitude: webhookData?.location?.latitude,
          longitude: webhookData?.location?.longitude,
          google_maps_link: webhookData?.location?.google_maps_link,
          coordinates_string: `${webhookData?.location?.latitude},${webhookData?.location?.longitude}`
        },
        
        // IP and device info
        ip_info: getClientIP(),
        
        // Additional data (without message formatting)
        scan_id: webhookData?.scan_id,
        finder_message: webhookData?.finder_message,
        
        // Metadata for n8n processing
        webhook_timestamp: new Date()?.toISOString(),
        data_format: 'raw_data_only',
        message_construction: 'handled_by_n8n'
        
        // REMOVED: message_template (n8n will construct the message)
      };

      // Make the webhook request
      const response = await axios?.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 seconds timeout
      });

      return {
        success: true,
        message: 'Raw data sent to webhook successfully',
        response: response?.data,
        status: response?.status
      };
    } catch (error) {
      // Handle different types of errors
      if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
        return {
          success: false,
          message: 'Cannot connect to notification service. The webhook endpoint may be unavailable.',
          error: error?.message
        };
      }
      
      if (error?.response) {
        // Server responded with error status
        return {
          success: false,
          message: `Webhook request failed with status ${error?.response?.status}`,
          status: error?.response?.status,
          error: error?.response?.data
        };
      }
      
      if (error?.request) {
        // Request timeout or no response
        return {
          success: false,
          message: 'Webhook request timed out or no response received',
          error: error?.message
        };
      }
      
      // Other errors
      return {
        success: false,
        message: 'Failed to send webhook notification',
        error: error?.message
      };
    }
  }
};
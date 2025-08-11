-- Fix ambiguous column reference in process_pet_scan_webhook function
CREATE OR REPLACE FUNCTION public.process_pet_scan_webhook(tag_identifier text, scan_latitude numeric, scan_longitude numeric, device_info jsonb DEFAULT NULL::jsonb, finder_message text DEFAULT NULL::text)
 RETURNS TABLE(success boolean, message text, pet_name text, owner_whatsapp text, webhook_data jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    found_tag_id UUID;
    found_pet_id UUID;
    found_pet_name TEXT;
    found_owner_whatsapp TEXT;
    scan_id UUID;
    webhook_payload JSONB;
BEGIN
    -- Find the NFC tag and associated pet
    -- Fixed: Explicitly qualify the column with table alias to avoid ambiguity
    SELECT nt.id, nt.pet_id, p.name, up.whatsapp_number
    INTO found_tag_id, found_pet_id, found_pet_name, found_owner_whatsapp
    FROM public.nfc_tags nt
    JOIN public.pets p ON nt.pet_id = p.id
    JOIN public.user_profiles up ON p.owner_id = up.id
    WHERE nt.tag_identifier = process_pet_scan_webhook.tag_identifier AND nt.is_active = true;

    IF found_tag_id IS NULL THEN
        RETURN QUERY SELECT false, 'NFC tag not found or inactive'::TEXT, NULL::TEXT, NULL::TEXT, NULL::JSONB;
        RETURN;
    END IF;

    -- Create scan record
    INSERT INTO public.pet_scans (
        nfc_tag_id, pet_id, latitude, longitude, 
        scanner_device_info, scan_timestamp, finder_message
    ) VALUES (
        found_tag_id, found_pet_id, scan_latitude, scan_longitude,
        device_info, CURRENT_TIMESTAMP, finder_message
    ) RETURNING id INTO scan_id;

    -- Prepare webhook payload for n8n
    webhook_payload := jsonb_build_object(
        'tag_identifier', process_pet_scan_webhook.tag_identifier,
        'pet_name', found_pet_name,
        'owner_whatsapp', found_owner_whatsapp,
        'location', jsonb_build_object(
            'latitude', scan_latitude,
            'longitude', scan_longitude,
            'google_maps_link', 'https://maps.google.com/?q=' || scan_latitude || ',' || scan_longitude
        ),
        'scan_timestamp', CURRENT_TIMESTAMP,
        'scan_id', scan_id,
        'finder_message', finder_message
    );

    RETURN QUERY SELECT 
        true, 
        'Scan recorded successfully'::TEXT, 
        found_pet_name, 
        found_owner_whatsapp,
        webhook_payload;
END;
$function$;
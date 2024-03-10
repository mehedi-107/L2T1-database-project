CREATE OR REPLACE PROCEDURE "public"."admit_to_cabin"(IN "patient_id_param" int4, IN "cabin_type_param" varchar, OUT "msg" varchar)
 AS $BODY$
DECLARE
    cabin_rec RECORD;
    doc_day_name VARCHAR(255);
    doc_night_name VARCHAR(255);
    nurse_names VARCHAR(255);
nurse_names_i VARCHAR(255);
    nurse_ids VARCHAR(255);
    doctor_day_id INT;
    doctor_night_id INT;
    nurse_id INT;
    cabin_found BOOLEAN := FALSE;
BEGIN
    -- Initialize message
    msg := '';

    -- Search for an empty cabin of the required type
    FOR cabin_rec IN
        SELECT *
        FROM "CABIN"
        WHERE "CABIN_TYPE" = cabin_type_param AND "PATIENT_ID" IS NULL
    LOOP
        -- Retrieve doctor IDs for the cabin
        doctor_day_id := cabin_rec."DOCTOR_ID_DAY";
        doctor_night_id := cabin_rec."DOCTOR_ID_NIGHT";

        -- Retrieve doctor names
        SELECT CONCAT("FIRST_NAME", ' ', "LAST_NAME") INTO doc_day_name
        FROM "DOCTORS"
        WHERE "DOCTOR_ID" = doctor_day_id;

        SELECT CONCAT("FIRST_NAME", ' ', "LAST_NAME") INTO doc_night_name
        FROM "DOCTORS"
        WHERE "DOCTOR_ID" = doctor_night_id;

        -- Retrieve nurse IDs and names
        nurse_ids := '';
        nurse_names := '';
nurse_names_i := '';
        FOR i IN 1..2 LOOP -- Assuming a cabin has two nurses
            IF i = 1 THEN nurse_id := cabin_rec."NURSE_ID_1";
ELSE nurse_id := cabin_rec."NURSE_ID_2";
END IF;
            IF nurse_id IS NOT NULL THEN
                nurse_ids := nurse_ids || nurse_id || ', ';
               
                SELECT CONCAT("FIRST_NAME", ' ', "LAST_NAME") INTO nurse_names_i
                FROM "NURSES"
                WHERE "NURSE_ID" = nurse_id;
               
                nurse_names := nurse_names || nurse_names_i || ' (' || nurse_id || '), ';
            END IF;
        END LOOP;

        -- Trim trailing comma and space
        nurse_ids := TRIM(TRAILING ', ' FROM nurse_ids);
        nurse_names := TRIM(TRAILING ', ' FROM nurse_names);

        -- Update cabin with patient ID
        UPDATE "CABIN"
        SET "PATIENT_ID" = patient_id_param
        WHERE "CABIN_NO" = cabin_rec."CABIN_NO" AND "FLOOR_NO" = cabin_rec."FLOOR_NO";

        -- Prepare message
        msg := 'Patient ' || patient_id_param || ' admitted to Cabin ' || cabin_rec."CABIN_NO" ||
               ', Floor ' || cabin_rec."FLOOR_NO" || '. Assigned doctors: ' || doc_day_name ||
               ' (' || doctor_day_id || ', Day), ' || doc_night_name || ' (' || doctor_night_id || ', Night). ' ||
               'Nurses: ' || nurse_names;
               
        cabin_found := TRUE;
        EXIT; -- Exit loop once a cabin is found
    END LOOP;

    -- If no empty cabin of the required type is found
    IF NOT cabin_found THEN
        msg := 'No available cabin of type ' || cabin_type_param || ' right now.';
    END IF;
END;
$BODY$
  LANGUAGE plpgsql
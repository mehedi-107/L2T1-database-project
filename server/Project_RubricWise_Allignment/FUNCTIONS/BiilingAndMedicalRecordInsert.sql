CREATE OR REPLACE FUNCTION "public"."insert_billing_and_medical_record_data"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
BEGIN
    DECLARE
        appointment_fee FLOAT;
    BEGIN
        -- Insert data into BILLING table
        INSERT INTO "BILLING" ("APPOINTMENT_ID", "DATE")
        VALUES (NEW."APPOINTMENT_ID", CURRENT_DATE);

        -- Get the appointment fee for the doctor
        SELECT "APPOINTMENT_FEE" INTO appointment_fee
        FROM "DOCTORS"
        WHERE "DOCTOR_ID" = NEW."DOCTOR_ID";

        -- Insert data into MEDICAL_RECORD_PATIENT table
        INSERT INTO "MEDICAL_RECORD_PATIENT" ("APPOINTMENT_ID", "DOCTOR_ID", "PATIENT_ID", "SERVICE_TYPE", "SERVICE_DATE")
        VALUES (NEW."APPOINTMENT_ID", NEW."DOCTOR_ID", NEW."PATIENT_ID", 'Appointment', NEW."APPOINTMENT_DATE");

        -- Update the AMOUNT_DUE in BILLING table with the appointment fee
        UPDATE "BILLING"
        SET "AMOUNT_DUE" = appointment_fee
        WHERE "APPOINTMENT_ID" = NEW."APPOINTMENT_ID";

        -- Return NEW to indicate that the trigger should proceed with the original action (INSERT)
        RETURN NEW;
    END;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
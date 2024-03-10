CREATE OR REPLACE FUNCTION "public"."update_medical_record_trigger"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
    appointment_fee FLOAT;
BEGIN
    
    IF TG_OP = 'UPDATE' AND NEW."SERVICE_DATE" IS NOT NULL THEN

        SELECT "AMOUNT_DUE" INTO appointment_fee
        FROM "BILLING"
        WHERE "APPOINTMENT_ID" = NEW."APPOINTMENT_ID";
				
        DELETE FROM "APPOINTMENT"
        WHERE "APPOINTMENT_ID" = NEW."APPOINTMENT_ID";
        DELETE FROM "BILLING"
        WHERE "APPOINTMENT_ID" = NEW."APPOINTMENT_ID";
    END IF;

    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE TRIGGER update_medical_record
AFTER UPDATE
ON "MEDICAL_RECORD_PATIENT"
FOR EACH ROW
EXECUTE FUNCTION "public"."update_medical_record_trigger"();
```
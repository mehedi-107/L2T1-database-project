-- 3 Identical triggers for password validation on "DOCTORS", "NURSES", and "PATIENTS" tables
-- Trigger for "DOCTORS" table (similar to "PATIENTS" table)
CREATE OR REPLACE FUNCTION check_doctor_password() RETURNS TRIGGER AS $$
DECLARE
    pass_criteria BOOLEAN;
BEGIN
    pass_criteria :=
        NEW."PASSWORD" ~ '[A-Z]' AND
        NEW."PASSWORD" ~ '[a-z]' AND
        NEW."PASSWORD" ~ '\d' AND
        NEW."PASSWORD" ~ '[!@#$%^&*()]' AND
        LENGTH(NEW."PASSWORD") >= 8;

    IF pass_criteria THEN
        INSERT INTO "TRIGGER_MESSAGES" ("message") VALUES ('ACCOUNT INFORMATION SAVED');
        RETURN NEW;
    ELSE
        INSERT INTO "TRIGGER_MESSAGES" ("message") VALUES ('PASSWORD DOES NOT MEET CRITERIA');
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_update_doctor
BEFORE INSERT OR UPDATE
OF "PASSWORD"
ON "DOCTORS"
FOR EACH ROW
EXECUTE FUNCTION check_doctor_password();


-- Trigger for "NURSES" table (similar to "PATIENTS" and "DOCTORS" tables)
CREATE OR REPLACE FUNCTION check_nurse_password() RETURNS TRIGGER AS $$
DECLARE
    pass_criteria BOOLEAN;
BEGIN
    pass_criteria :=
        NEW."PASSWORD" ~ '[A-Z]' AND
        NEW."PASSWORD" ~ '[a-z]' AND
        NEW."PASSWORD" ~ '\d' AND
        NEW."PASSWORD" ~ '[!@#$%^&*()]' AND
        LENGTH(NEW."PASSWORD") >= 8;

    IF pass_criteria THEN
        INSERT INTO "TRIGGER_MESSAGES" ("message") VALUES ('ACCOUNT INFORMATION SAVED');
        RETURN NEW;
    ELSE
        INSERT INTO "TRIGGER_MESSAGES" ("message") VALUES ('PASSWORD DOES NOT MEET CRITERIA');
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_update_nurse
BEFORE INSERT OR UPDATE
OF "PASSWORD"
ON "NURSES"
FOR EACH ROW
EXECUTE FUNCTION check_nurse_password();

CREATE OR REPLACE FUNCTION "public"."check_password_criteria"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
    pass_length INT;
    pass_uppercase INT;
    pass_lowercase INT;
    pass_digit INT;
    pass_special INT;
    pass_contains_name INT;
    trigger_msg VARCHAR(255);
BEGIN
    -- Check password length
    pass_length := LENGTH(NEW."PASSWORD");

    -- Check for uppercase, lowercase, digit, and special characters
    pass_uppercase := LENGTH(REGEXP_REPLACE(NEW."PASSWORD", '[^A-Z]', '', 'g'));
    pass_lowercase := LENGTH(REGEXP_REPLACE(NEW."PASSWORD", '[^a-z]', '', 'g'));
    pass_digit := LENGTH(REGEXP_REPLACE(NEW."PASSWORD", '[^0-9]', '', 'g'));
    pass_special := LENGTH(REGEXP_REPLACE(NEW."PASSWORD", '[A-Za-z0-9]', '', 'g'));

    -- Check if password contains the patient's first or last name
    pass_contains_name := 0;
    IF NEW."FIRST_NAME" IS NOT NULL AND NEW."LAST_NAME" IS NOT NULL THEN
        IF POSITION(NEW."FIRST_NAME" IN NEW."PASSWORD") > 0 OR POSITION(NEW."LAST_NAME" IN NEW."PASSWORD") > 0 THEN
            pass_contains_name := 1;
        END IF;
    END IF;

    -- Check password criteria
    IF pass_length >= 8 AND pass_uppercase >= 1 AND pass_lowercase >= 1 AND pass_digit >= 1 AND pass_special >= 1 AND pass_contains_name = 0 THEN
        -- Password meets criteria
        trigger_msg := 'ACCOUNT INFORMATION SAVED';
    ELSE
        -- Password does not meet criteria
        trigger_msg := 'REQUIRED CRITERIA NOT FULFILLED';
    END IF;

    -- Insert trigger message into TRIGGER_MESSAGES table
    INSERT INTO "TRIGGER_MESSAGES" (message) VALUES (trigger_msg);

    -- Allow or block insertion based on password criteria
    IF trigger_msg = 'ACCOUNT INFORMATION SAVED' THEN
        RETURN NEW;
    ELSE
        RETURN NULL;
    END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100

CREATE TRIGGER check_password_criteria_trigger
BEFORE INSERT OR UPDATE
OF "PASSWORD"
ON "PATIENTS"
FOR EACH ROW
EXECUTE FUNCTION check_password_criteria();
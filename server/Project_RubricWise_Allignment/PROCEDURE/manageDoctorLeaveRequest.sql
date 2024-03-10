CREATE OR REPLACE PROCEDURE "public"."manage_doctor_leave_request"(IN "doctor_id_param" int4, OUT "msg" varchar)
 AS $BODY$
DECLARE
    f INT;
u INT;
leave_interval INT;
i RECORD;
ward_rec RECORD;
    cabin_rec RECORD;
    temp_doctor_id INT;
    temp_doctor_name VARCHAR(255);
    temp_doctor_dept_id INT;
    temp_leave_count INT;
BEGIN
    msg := 'Doctor ' || doctor_id_param || ' UPDATED WARD INFO : ';
    f := 0; u := 0;
    -- Get the department ID of the input doctor
    SELECT "DEPT_ID" INTO temp_doctor_dept_id FROM "DOCTORS" WHERE "DOCTOR_ID" = doctor_id_param;
    FOR ward_rec IN
        SELECT * FROM "WARD" WHERE "DOCTOR_ID_DAY" = doctor_id_param OR "DOCTOR_ID_NIGHT" = doctor_id_param
    LOOP
        -- Check if the doctor has approved leave requests
FOR i IN SELECT * FROM "DOCTORS"
LOOP
IF(i."DEPT_ID" = temp_doctor_dept_id AND i."DOCTOR_ID" <> doctor_id_param) THEN
SELECT COUNT(*) INTO temp_leave_count
FROM "LEAVE_REQUESTS"
WHERE "APPLICANT_ID" = i."DOCTOR_ID" AND "APPROVAL" = 'Approved' AND "END_DATE" >= CURRENT_DATE;
IF temp_leave_count = 0 THEN
IF (
                    SELECT COUNT(*)
                    FROM "WARD"
                    WHERE ("DOCTOR_ID_DAY" = i."DOCTOR_ID" OR "DOCTOR_ID_NIGHT" = i."DOCTOR_ID")
                ) <= 1 THEN

IF ward_rec."DOCTOR_ID_DAY" = doctor_id_param THEN
                        UPDATE "WARD" SET "DOCTOR_ID_DAY" = i."DOCTOR_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
                    ELSE
                        UPDATE "WARD" SET "DOCTOR_ID_NIGHT" = i."DOCTOR_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
                    END IF;
                    -- Update msg with reassignment information
                    msg := msg || 'Reassigned ' || i."FIRST_NAME" || ' ' || i."LAST_NAME" || '(' || i."DOCTOR_ID" || ') in Ward ' || ward_rec."WARD_NO" || ', Floor ' || ward_rec."FLOOR_NO" || '. ';
f := 1;
                    EXIT;
END IF;
END IF;
END IF;
END LOOP;
IF(f = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = doctor_id_param AND "APPROVAL" = 'Pending';
u := 1; EXIT;
END IF;
END LOOP;
msg := msg || ' UPDATED CABIN INFO : ';f := 0;
FOR cabin_rec IN
        SELECT * FROM "CABIN" WHERE "DOCTOR_ID_DAY" = doctor_id_param OR "DOCTOR_ID_NIGHT" = doctor_id_param
    LOOP
        -- Check if the doctor has approved leave requests
FOR i IN SELECT * FROM "DOCTORS"
LOOP
IF(i."DEPT_ID" = temp_doctor_dept_id AND i."DOCTOR_ID" <> doctor_id_param) THEN
SELECT COUNT(*) INTO temp_leave_count
FROM "LEAVE_REQUESTS"
WHERE "APPLICANT_ID" = i."DOCTOR_ID" AND "APPROVAL" = 'Approved' AND "END_DATE" >= CURRENT_DATE;
IF temp_leave_count = 0 THEN
IF (
                    SELECT COUNT(*)
                    FROM "CABIN"
                    WHERE ("DOCTOR_ID_DAY" = i."DOCTOR_ID" OR "DOCTOR_ID_NIGHT" = i."DOCTOR_ID")
                ) <= 3 THEN

IF cabin_rec."DOCTOR_ID_DAY" = doctor_id_param THEN
                        UPDATE "CABIN" SET "DOCTOR_ID_DAY" = i."DOCTOR_ID" WHERE "CABIN_NO" = cabin_rec."CABIN_NO" AND "FLOOR_NO" = cabin_rec."FLOOR_NO";
                    ELSE
                        UPDATE "CABIN" SET "DOCTOR_ID_NIGHT" = i."DOCTOR_ID" WHERE "CABIN_NO" = cabin_rec."CABIN_NO" AND "FLOOR_NO" = cabin_rec."FLOOR_NO";
                    END IF;
                    -- Update msg with reassignment information
                    msg := msg || 'Reassigned ' || i."FIRST_NAME" || ' ' || i."LAST_NAME" || '(' || i."DOCTOR_ID" || ') in Cabin ' || cabin_rec."CABIN_NO" || ', Floor ' || cabin_rec."FLOOR_NO" || '. ';
f := 1;
                    EXIT;

END IF;
END IF;
END IF;
END LOOP;
IF(f = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = doctor_id_param AND "APPROVAL" = 'Pending';
u := 1; EXIT;
END IF;
END LOOP;
if(u = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Approved' WHERE "APPLICANT_ID" = doctor_id_param AND "APPROVAL" = 'Pending';u := 2;
SELECT ("END_DATE" - "START_DATE") INTO leave_interval FROM "LEAVE_REQUESTS" WHERE "APPLICANT_ID" = doctor_id_param AND "APPROVAL" = 'Approved' AND "START_DATE" >= CURRENT_DATE;
        EXECUTE 'UPDATE "APPOINTMENT"
                    SET "APPOINTMENT_DATE" = "APPOINTMENT_DATE" + INTERVAL ''' || leave_interval || ' days'''
                    ' WHERE "DOCTOR_ID" = ' || doctor_id_param ||
                    ' AND "APPOINTMENT_DATE" >= (SELECT "START_DATE"
                                               FROM "LEAVE_REQUESTS"
                                               WHERE "APPLICANT_ID" = ' || doctor_id_param ||
                                               ' AND "APPROVAL" = ''Approved''
                                               AND "START_DATE" >= CURRENT_DATE)';
END IF;
msg := msg || ' Appointments have been rescheduled accordingly. Leave request of Doctor ' || doctor_id_param;
IF(u = 1) THEN msg := msg || ' rejected. ';
ELSE msg := msg || ' approved. ';
END IF;
END;
$BODY$
  LANGUAGE plpgsql
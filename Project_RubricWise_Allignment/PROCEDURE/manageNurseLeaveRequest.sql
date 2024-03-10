CREATE OR REPLACE PROCEDURE "public"."manage_nurse_leave_request"(IN "nurse_id_param" int4, OUT "msg" varchar)
 AS $BODY$
DECLARE
    f INT;
u INT;
leave_interval INT;
i RECORD;
ward_rec RECORD;
    cabin_rec RECORD;
    temp_nurse_id INT;
    temp_nurse_name VARCHAR(255);
    temp_nurse_dept_id INT;
    temp_leave_count INT;
BEGIN
    msg := 'Nurse ' || nurse_id_param || ' UPDATED WARD INFO : ';
    f := 0; u := 0;
    SELECT "DEPT_ID" INTO temp_nurse_dept_id FROM "NURSES" WHERE "NURSE_ID" = nurse_id_param;
    FOR ward_rec IN
        SELECT * FROM "WARD" WHERE nurse_id_param IN ("NURSE_ID_1", "NURSE_ID_2", "NURSE_ID_3", "NURSE_ID_4")
    LOOP
FOR i IN SELECT * FROM "NURSES"
LOOP
IF(i."DEPT_ID" = temp_nurse_dept_id AND i."NURSE_ID" <> nurse_id_param) THEN
SELECT COUNT(*) INTO temp_leave_count
FROM "LEAVE_REQUESTS"
WHERE "APPLICANT_ID" = i."NURSE_ID" AND "APPROVAL" = 'Approved' AND "END_DATE" >= CURRENT_DATE;
IF temp_leave_count = 0 THEN
IF (
                    SELECT COUNT(*)
                    FROM "WARD"
                    WHERE i."NURSE_ID" IN ("NURSE_ID_1", "NURSE_ID_2", "NURSE_ID_3", "NURSE_ID_4")
                ) <= 1 THEN

IF ward_rec."NURSE_ID_1" = nurse_id_param THEN
                        UPDATE "WARD" SET "NURSE_ID_1" = i."NURSE_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
                    ELSIF ward_rec."NURSE_ID_2" = nurse_id_param THEN
                        UPDATE "WARD" SET "NURSE_ID_2" = i."NURSE_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
ELSIF ward_rec."NURSE_ID_3" = nurse_id_param THEN
                        UPDATE "WARD" SET "NURSE_ID_3" = i."NURSE_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
ELSE
                        UPDATE "WARD" SET "NURSE_ID_4" = i."NURSE_ID" WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
                    END IF;
                    msg := msg || 'Reassigned ' || i."FIRST_NAME" || ' ' || i."LAST_NAME" || '(' || i."NURSE_ID" || ') in Ward ' || ward_rec."WARD_NO" || ', Floor ' || ward_rec."FLOOR_NO" || '. ';
f := 1;
                    EXIT;
END IF;
END IF;
END IF;
END LOOP;
IF(f = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = nurse_id_param AND "APPROVAL" = 'Pending';
u := 1; EXIT;
END IF;
END LOOP;
msg := msg || ' UPDATED CABIN INFO : ';f := 0;
FOR cabin_rec IN
        SELECT * FROM "CABIN" WHERE nurse_id_param IN ("NURSE_ID_1", "NURSE_ID_2")
    LOOP
       
FOR i IN SELECT * FROM "NURSES"
LOOP
IF(i."DEPT_ID" = temp_nurse_dept_id AND i."NURSE_ID" <> nurse_id_param) THEN
SELECT COUNT(*) INTO temp_leave_count
FROM "LEAVE_REQUESTS"
WHERE "APPLICANT_ID" = i."NURSE_ID" AND "APPROVAL" = 'Approved' AND "END_DATE" >= CURRENT_DATE;
IF temp_leave_count = 0 THEN
IF (
                    SELECT COUNT(*)
                    FROM "CABIN"
                    WHERE i."NURSE_ID" IN ("NURSE_ID_1", "NURSE_ID_2")
                ) <= 3 THEN

IF cabin_rec."NURSE_ID_1" = nurse_id_param THEN
                        UPDATE "CABIN" SET "NURSE_ID_1" = i."NURSE_ID" WHERE "CABIN_NO" = cabin_rec."CABIN_NO" AND "FLOOR_NO" = cabin_rec."FLOOR_NO";
                    ELSE
                        UPDATE "CABIN" SET "NURSE_ID_2" = i."NURSE_ID" WHERE "CABIN_NO" = cabin_rec."CABIN_NO" AND "FLOOR_NO" = cabin_rec."FLOOR_NO";
                    END IF;
                   
                    msg := msg || 'Reassigned ' || i."FIRST_NAME" || ' ' || i."LAST_NAME" || '(' || i."NURSE_ID" || ') in Cabin ' || cabin_rec."CABIN_NO" || ', Floor ' || cabin_rec."FLOOR_NO" || '. ';
f := 1;
                    EXIT;

END IF;
END IF;
END IF;
END LOOP;
IF(f = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Rejected' WHERE "APPLICANT_ID" = nurse_id_param AND "APPROVAL" = 'Pending';
u := 1; EXIT;
END IF;
END LOOP;
if(u = 0) THEN
UPDATE "LEAVE_REQUESTS" SET "APPROVAL" = 'Approved' WHERE "APPLICANT_ID" = nurse_id_param AND "APPROVAL" = 'Pending';u := 2;
END IF;
msg := msg || ' Leave request of Nurse ' || nurse_id_param;
IF(u = 1) THEN msg := msg || ' rejected. ';
ELSE msg := msg || ' approved. ';
END IF;
END;
$BODY$
  LANGUAGE plpgsql
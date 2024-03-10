CREATE OR REPLACE PROCEDURE "public"."admit_patient"(IN "patient_id" int4, IN "required_specialist_type" varchar, OUT "msg" varchar)
 AS $BODY$
DECLARE
    f INT;
dept_id_temp INT;
    ward_rec RECORD;
    ward_no_temp INT;
    bed_no_temp INT;
    doc_day_temp INT;
    doc_night_temp INT;
    doc_name_day VARCHAR(255);
    doc_name_night VARCHAR(255);
    nurse_names VARCHAR(255);
		nurse_names_j VARCHAR(255);
    nurse_ids VARCHAR(255);
    nurse_id_temp INT;
BEGIN
    f := 0;
    msg := 'No available bed in a ward with ' || required_specialist_type || ' specialist.';
    SELECT "DEPARTMENT_ID" INTO dept_id_temp
    FROM "DEPARTMENTS"
    WHERE "DEPARTMENT_NAME" = required_specialist_type;
    FOR ward_rec IN
        SELECT *
        FROM "WARD"
    LOOP EXIT WHEN f = 1;
        FOR i IN 1..10 LOOP EXIT WHEN f = 1;
            EXECUTE 'SELECT "BED_' || i || '" FROM "WARD" WHERE "WARD_NO" = ' || ward_rec."WARD_NO" || ' AND "FLOOR_NO" = ' || ward_rec."FLOOR_NO" INTO bed_no_temp;
            IF bed_no_temp IS NULL THEN
                SELECT "DOCTOR_ID_DAY", "DOCTOR_ID_NIGHT" INTO doc_day_temp, doc_night_temp
                FROM "WARD"
                WHERE "WARD_NO" = ward_rec."WARD_NO" AND "FLOOR_NO" = ward_rec."FLOOR_NO";
               
                SELECT CONCAT("FIRST_NAME", ' ', "LAST_NAME") INTO doc_name_day
                FROM "DOCTORS"
                WHERE "DOCTOR_ID" = doc_day_temp;
               
                SELECT CONCAT("FIRST_NAME", ' ', "LAST_NAME") INTO doc_name_night
                FROM "DOCTORS"
                WHERE "DOCTOR_ID" = doc_night_temp;
               
                IF doc_day_temp IS NOT NULL THEN
                    IF (SELECT "DEPT_ID" FROM "DOCTORS" WHERE "DOCTOR_ID" = doc_day_temp) = dept_id_temp THEN
            
                        EXECUTE 'UPDATE "WARD" SET "BED_' || i || '" = $1 WHERE "WARD_NO" = $2 AND "FLOOR_NO" = $3' USING patient_id, ward_rec."WARD_NO", ward_rec."FLOOR_NO";
                       
                        nurse_names := '';
												nurse_names_j := '';
                        nurse_ids := '';
                        FOR j IN 1..4 LOOP
                            EXECUTE 'SELECT "NURSE_ID_' || j || '" FROM "WARD" WHERE "WARD_NO" = ' || ward_rec."WARD_NO" || ' AND "FLOOR_NO" = ' || ward_rec."FLOOR_NO" INTO nurse_id_temp;
                            IF nurse_id_temp IS NOT NULL THEN
                                EXECUTE 'SELECT CONCAT("FIRST_NAME", '' '', "LAST_NAME") FROM "NURSES" WHERE "NURSE_ID" = ' || nurse_id_temp INTO nurse_names_j;
                                nurse_ids := nurse_ids || nurse_id_temp || ', ';
                                nurse_names := nurse_names || nurse_names_j || ' (' || nurse_id_temp || '), ';
                            END IF;
                        END LOOP;
                        nurse_ids := TRIM(TRAILING ', ' FROM nurse_ids);
                        nurse_names := TRIM(TRAILING ', ' FROM nurse_names);
                       
                        -- Prepare output message
                        msg := 'Patient ' || patient_id || ' admitted to Ward ' || ward_rec."WARD_NO" ||
                               ', Bed ' || i || '. Assigned doctors: ' || doc_name_day ||
                               ' (' || doc_day_temp || ', Day), ' || doc_name_night || ' (' || doc_night_temp || ', Night). ' ||
                               'Nurses: ' || nurse_names;
 f := 1;
                    END IF;
                END IF;
            END IF;
        END LOOP;
    END LOOP;
END;
$BODY$
  LANGUAGE plpgsql
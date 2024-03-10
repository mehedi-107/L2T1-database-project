CREATE OR REPLACE FUNCTION "public"."get_ward_history"("patient_id" int4)
  RETURNS TABLE("date_column" timestamp, "ward_no" int4, "floor_no" int4, "doctor_id_day" int4, "doctor_name_day" varchar, "doctor_id_night" int4, "doctor_name_night" varchar, "nurse_id_1" int4, "nurse_name_1" varchar, "nurse_id_2" int4, "nurse_name_2" varchar, "nurse_id_3" int4, "nurse_name_3" varchar, "nurse_id_4" int4, "nurse_name_4" varchar, "ward_boy_id_1" int4, "ward_boy_id_2" int4, "ward_boy_id_3" int4, "ward_boy_id_4" int4, "ward_boy_id_5" int4) AS $BODY$
BEGIN
    RETURN QUERY
    SELECT wh."DATE" AS DATE_COLUMN,
           wh."WARD_NO",
           wh."FLOOR_NO",
           wh."DOCTOR_ID_DAY",
           CAST(CONCAT(d1."FIRST_NAME", ' ', d1."LAST_NAME") AS VARCHAR(100)) AS DOCTOR_NAME_DAY,
           wh."DOCTOR_ID_NIGHT",
           CAST(CONCAT(d2."FIRST_NAME", ' ', d2."LAST_NAME") AS VARCHAR(100)) AS DOCTOR_NAME_NIGHT,
           wh."NURSE_ID_1",
           CAST(CONCAT(n1."FIRST_NAME", ' ', n1."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_1,
           wh."NURSE_ID_2",
           CAST(CONCAT(n2."FIRST_NAME", ' ', n2."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_2,
           wh."NURSE_ID_3",
           CAST(CONCAT(n3."FIRST_NAME", ' ', n3."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_3,
           wh."NURSE_ID_4",
           CAST(CONCAT(n4."FIRST_NAME", ' ', n4."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_4,
           wh."WARD_BOY_ID_1",
           wh."WARD_BOY_ID_2",
           wh."WARD_BOY_ID_3",
           wh."WARD_BOY_ID_4",
           wh."WARD_BOY_ID_5"
    FROM "WARD_HISTORY" wh
    LEFT JOIN "DOCTORS" d1 ON wh."DOCTOR_ID_DAY" = d1."DOCTOR_ID"
    LEFT JOIN "DOCTORS" d2 ON wh."DOCTOR_ID_NIGHT" = d2."DOCTOR_ID"
    LEFT JOIN "NURSES" n1 ON wh."NURSE_ID_1" = n1."NURSE_ID"
    LEFT JOIN "NURSES" n2 ON wh."NURSE_ID_2" = n2."NURSE_ID"
    LEFT JOIN "NURSES" n3 ON wh."NURSE_ID_3" = n3."NURSE_ID"
    LEFT JOIN "NURSES" n4 ON wh."NURSE_ID_4" = n4."NURSE_ID"
    WHERE patient_id IN (wh."BED_1", wh."BED_2", wh."BED_3", wh."BED_4", wh."BED_5",
                         wh."BED_6", wh."BED_7", wh."BED_8", wh."BED_9", wh."BED_10");
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000





CREATE OR REPLACE FUNCTION "public"."get_patient_cabin_history"("patient_id" int4)
  RETURNS TABLE("date_column" date, "cabin_no" int4, "floor_no" int4, "patient_name" varchar, "doctor_id_day" int4, "doctor_name_day" varchar, "doctor_id_night" int4, "doctor_name_night" varchar, "cabin_type" varchar, "nurse_id_1" int4, "nurse_name_1" varchar, "nurse_id_2" int4, "nurse_name_2" varchar) AS $BODY$
BEGIN
    RETURN QUERY
    SELECT ch."DATE" AS DATE_COLUMN,
           ch."CABIN_NO",
           ch."FLOOR_NO",
           CAST(CONCAT(pd."FIRST_NAME", ' ', pd."LAST_NAME") AS VARCHAR(100)) AS PATIENT_NAME,
           ch."DOCTOR_ID_DAY",
           CAST(CONCAT(dd1."FIRST_NAME", ' ', dd1."LAST_NAME") AS VARCHAR(100)) AS DOCTOR_NAME_DAY,
           ch."DOCTOR_ID_NIGHT",
           CAST(CONCAT(dd2."FIRST_NAME", ' ', dd2."LAST_NAME") AS VARCHAR(100)) AS DOCTOR_NAME_NIGHT,
           ch."CABIN_TYPE",
           ch."NURSE_ID_1",
           CAST(CONCAT(nd1."FIRST_NAME", ' ', nd1."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_1,
           ch."NURSE_ID_2",
           CAST(CONCAT(nd2."FIRST_NAME", ' ', nd2."LAST_NAME") AS VARCHAR(100)) AS NURSE_NAME_2
    FROM "CABIN_HISTORY" ch
    LEFT JOIN "PATIENTS" pd ON ch."PATIENT_ID" = pd."PATIENT_ID"
    LEFT JOIN "DOCTORS" dd1 ON ch."DOCTOR_ID_DAY" = dd1."DOCTOR_ID"
    LEFT JOIN "DOCTORS" dd2 ON ch."DOCTOR_ID_NIGHT" = dd2."DOCTOR_ID"
    LEFT JOIN "NURSES" nd1 ON ch."NURSE_ID_1" = nd1."NURSE_ID"
    LEFT JOIN "NURSES" nd2 ON ch."NURSE_ID_2" = nd2."NURSE_ID"
    WHERE ch."PATIENT_ID" = patient_id;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000
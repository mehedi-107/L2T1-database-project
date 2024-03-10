CREATE OR REPLACE FUNCTION "public"."getdoctoractivitiesinward"("DOCTOR_ID_IN" int4, "WARD_NO_IN" int4, "FLOOR_NO_IN" int4, "TIMEFRAME_IN" interval)
  RETURNS TABLE("DATE" timestamp, "DOCTOR_NAME" varchar, "PATIENT_NAMES" _varchar, "NURSE_NAMES" _varchar) AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        wh."DATE",
        CAST(CONCAT(d."FIRST_NAME", ' ', d."LAST_NAME") AS VARCHAR) AS "DOCTOR_NAME",
        ARRAY(
            SELECT CAST(CONCAT(p."FIRST_NAME", ' ', p."LAST_NAME") AS VARCHAR)
            FROM "PATIENTS" p
            WHERE p."PATIENT_ID" IN (wh."BED_1", wh."BED_2", wh."BED_3", wh."BED_4", wh."BED_5", wh."BED_6", wh."BED_7", wh."BED_8", wh."BED_9", wh."BED_10")
        ) AS "PATIENT_NAMES",
        ARRAY(
            SELECT CAST(CONCAT(n."FIRST_NAME", ' ', n."LAST_NAME") AS VARCHAR)
            FROM "NURSES" n
            WHERE n."NURSE_ID" IN (wh."NURSE_ID_1", wh."NURSE_ID_2", wh."NURSE_ID_3", wh."NURSE_ID_4")
        ) AS "NURSE_NAMES"
    FROM "WARD_HISTORY" wh
    JOIN "DOCTORS" d ON (wh."DOCTOR_ID_DAY" = d."DOCTOR_ID" OR wh."DOCTOR_ID_NIGHT" = d."DOCTOR_ID") AND d."DOCTOR_ID" = "DOCTOR_ID_IN"
    WHERE wh."WARD_NO" = "WARD_NO_IN"
    AND wh."FLOOR_NO" = "FLOOR_NO_IN"
    AND wh."DATE" >= CURRENT_TIMESTAMP - "TIMEFRAME_IN";
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000
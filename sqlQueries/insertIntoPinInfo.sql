INSERT INTO
    pin_info (latitude, longitude, country_id, fuel_id)
SELECT
    latitude :: NUMERIC,
    longitude :: NUMERIC,
    ci.country_id,
    fi.fuel_id
FROM
    tmp_power_plants tpp
    JOIN country_info ci ON tpp.country = ci.country_postal
    JOIN fuel_info fi ON tpp.primary_fuel = fi.fuel_name;
INSERT INTO country_info (country_postal, country_name, latitude, longitude, fuel_id)
SELECT 
    country,
    country_long,
    latitude::NUMERIC,
    longitude::NUMERIC,
    fi.fuel_id
FROM 
    tmp_power_plants AS tpp
JOIN 
    fuel_info AS fi ON tpp.primary_fuel = fi.fuel_name;

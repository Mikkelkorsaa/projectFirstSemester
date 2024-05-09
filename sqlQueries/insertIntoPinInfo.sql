INSERT INTO pin_info (country_postal, country_name, latitude, longitude, fuel_id)
SELECT 
    country,
    country_long,
    latitude::NUMERIC,
    longitude::NUMERIC,
    fi.fuel_id
FROM 
    tmp_power_plants tpp
JOIN 
    fuel_info fi ON tpp.primary_fuel = fi.fuel_name;

INSERT INTO country_info (country_postal, country_name)
SELECT 
    DISTINCT(country),
    country_long
FROM 
    tmp_power_plants
ORDER BY country_long
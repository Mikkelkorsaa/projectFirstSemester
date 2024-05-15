SELECT
  ci.country_postal,
  fi.fuel_name,
  COUNT(fuel_name) total
FROM
  country_info ci
  JOIN pin_info pi ON pi.country_id = ci.country_id
  JOIN fuel_info fi ON fi.fuel_id = pi.fuel_id
GROUP BY
  country_postal,
  fuel_name
ORDER BY
  ci.country_postal,
  fuel_name
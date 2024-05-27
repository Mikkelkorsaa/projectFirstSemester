CREATE TABLE fuel_info (
    fuel_id SERIAL PRIMARY KEY,
    fuel_name VARCHAR(20) NOT NULL,
    deathrate NUMERIC NOT NULL,
    co2_emission_in_tons INTEGER NOT NULL
);

CREATE TABLE country_info (
    country_id SERIAL PRIMARY KEY,
    country_postal VARCHAR(3) NOT NULL,
    country_name VARCHAR(60) NOT NULL
);

CREATE TABLE pin_info (
    pin_id SERIAL PRIMARY KEY,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    country_id INTEGER REFERENCES country_info(country_id),
    fuel_id INTEGER REFERENCES fuel_info(fuel_id)
);

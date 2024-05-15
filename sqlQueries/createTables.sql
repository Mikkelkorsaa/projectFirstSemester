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

CREATE TABLE green_energy (
    green_energy_id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES country_info(country_id),
    year_2000 NUMERIC NOT NULL,
    year_2001 NUMERIC NOT NULL,
    year_2002 NUMERIC NOT NULL,
    year_2003 NUMERIC NOT NULL,
    year_2004 NUMERIC NOT NULL,
    year_2005 NUMERIC NOT NULL,
    year_2006 NUMERIC NOT NULL,
    year_2007 NUMERIC NOT NULL,
    year_2008 NUMERIC NOT NULL,
    year_2009 NUMERIC NOT NULL,
    year_2010 NUMERIC NOT NULL,
    year_2011 NUMERIC NOT NULL,
    year_2012 NUMERIC NOT NULL,
    year_2013 NUMERIC NOT NULL,
    year_2014 NUMERIC NOT NULL,
    year_2015 NUMERIC NOT NULL,
    year_2016 NUMERIC NOT NULL,
    year_2017 NUMERIC NOT NULL,
    year_2018 NUMERIC NOT NULL,
    year_2019 NUMERIC NOT NULL,
    year_2020 NUMERIC NOT NULL,
    year_2021 NUMERIC NOT NULL
);

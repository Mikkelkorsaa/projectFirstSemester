const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");
const { response } = require("express");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
/*
const insertData = (request, response) => {
  const caldata = "../public/datasheets/EG_FEC_RNEW.csv";
  const options = {
    delimiter: ','
  }

  csvtojson().fromFile(caldata, options).then(source => {
    // Iterate through each row of the CSV data
    source.forEach(row => {
      /* // For the tmp_power_plants
      const { country, country_long, name, gppd_idnr, capacity_mw, latitude, longitude, primary_fuel, other_fuel1, other_fuel2, other_fuel3, commissioning_year, owner, url, geolocation_source, wepp_id, year_of_capacity_data, generation_gwh_2013, generation_gwh_2014, generation_gwh_2015, generation_gwh_2016, generation_gwh_2017, generation_gwh_2018, generation_gwh_2019, generation_data_source, estimated_generation_gwh_2013, estimated_generation_gwh_2014, estimated_generation_gwh_2015, estimated_generation_gwh_2016, estimated_generation_gwh_2017, estimated_generation_note_2013, estimated_generation_note_2014, estimated_generation_note_2015, estimated_generation_note_2016, estimated_generation_note_2017 } = row;

      const insertStatement = `INSERT INTO tmp_power_plants (country, country_long, name, gppd_idnr, capacity_mw, latitude, longitude, primary_fuel, other_fuel1, other_fuel2, other_fuel3, commissioning_year, owner, url, geolocation_source, wepp_id, year_of_capacity_data, generation_gwh_2013, generation_gwh_2014, generation_gwh_2015, generation_gwh_2016, generation_gwh_2017, generation_gwh_2018, generation_gwh_2019, generation_data_source, estimated_generation_gwh_2013, estimated_generation_gwh_2014, estimated_generation_gwh_2015, estimated_generation_gwh_2016, estimated_generation_gwh_2017, estimated_generation_note_2013, estimated_generation_note_2014, estimated_generation_note_2015, estimated_generation_note_2016, estimated_generation_note_2017) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)`;
      const items = [country, country_long, name, gppd_idnr, capacity_mw, latitude, longitude, primary_fuel, other_fuel1, other_fuel2, other_fuel3, commissioning_year, owner, url, geolocation_source, wepp_id, year_of_capacity_data, generation_gwh_2013, generation_gwh_2014, generation_gwh_2015, generation_gwh_2016, generation_gwh_2017, generation_gwh_2018, generation_gwh_2019, generation_data_source, estimated_generation_gwh_2013, estimated_generation_gwh_2014, estimated_generation_gwh_2015, estimated_generation_gwh_2016, estimated_generation_gwh_2017, estimated_generation_note_2013, estimated_generation_note_2014, estimated_generation_note_2015, estimated_generation_note_2016, estimated_generation_note_2017];
      */

      /* For the fuel_info
      const { source, deathrate, co2_emission_in_tons } = row;

      const insertStatement = `INSERT INTO fuel_info (fuel_name,deathrate,co2_emission_in_tons) VALUES ($1, $2, $3)`;
      const items = [source, deathrate, co2_emission_in_tons]; 
      */
      /*
      const { Goal, Target, Indicator, SeriesCode, SeriesDescription, GeoAreaCode, GeoAreaName, ReportingType, Units, year_2000, year_2001, year_2002, year_2003, year_2004, year_2005, year_2006, year_2007, year_2008, year_2009, year_2010, year_2011, year_2012, year_2013, year_2014, year_2015, year_2016, year_2017, year_2018, year_2019, year_2020, year_2021 } = row;

      const insertStatement = `INSERT INTO tmp_ren (
      Goal, Target, Indicator, SeriesCode, SeriesDescription, GeoAreaCode, GeoAreaName, ReportingType, Units, 
      year_2000, year_2001, year_2002, year_2003, year_2004, year_2005, year_2006, year_2007, year_2008, year_2009, 
      year_2010, year_2011, year_2012, year_2013, year_2014, year_2015, year_2016, year_2017, year_2018, year_2019, 
      year_2020, year_2021) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)`;

      const items = [
        Goal, Target, Indicator, SeriesCode, SeriesDescription, GeoAreaCode, GeoAreaName, ReportingType, Units,
        year_2000, year_2001, year_2002, year_2003, year_2004, year_2005, year_2006, year_2007, year_2008, year_2009,
        year_2010, year_2011, year_2012, year_2013, year_2014, year_2015, year_2016, year_2017, year_2018, year_2019,
        year_2020, year_2021
      ];




      // Inserting data of current row into database
      pool.query(insertStatement, items, (err, results) => {
        if (err) {
          console.error("Error inserting data:", err);
        }
      });
    });

    // Sending response after all data has been inserted
    response.status(201).send('All data added to database');
  }).catch(error => {
    console.error("Error converting CSV to JSON:", error);
    response.status(500).send('Error converting CSV to JSON');
  });
};
*/
const getPins = (request, response) => {
  pool.query("SELECT pi.latitude, pi.longitude, fi.fuel_name FROM pin_info pi JOIN fuel_info fi ON fi.fuel_id = pi.fuel_id", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getPowerPlantFuels = (request, response) => {
  pool.query("SELECT ci.country_postal, ci,country_name, fi.fuel_name, COUNT(fuel_name) total FROM country_info ci JOIN pin_info pi ON pi.country_id = ci.country_id JOIN fuel_info fi ON fi.fuel_id = pi.fuel_id GROUP BY country_postal, ci,country_name, fuel_name ORDER BY ci.country_postal, fuel_name", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

const getHeatmap = (request, response) => {
  pool.query("SELECT area_code, year_2021 FROM renewable_percentage ORDER BY area_code", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

module.exports = {
  //insertData,
  getPins,
  getPowerPlantFuels,
  getHeatmap
};

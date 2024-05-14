const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = process.env.PORT || 4000;

require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const path = require('path')
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (request, response) => {
  response.sendFile(path.resolve(__dirname, '../public/pages/index.html'));
});

app.post("/insert", db.insertData);
app.get("/get-pins", db.getPins)
app.get("/get-power-plant-fuels", db.getPowerPlantFuels)

app.listen(port, () => {
  console.log('App running on port ' + port)
});

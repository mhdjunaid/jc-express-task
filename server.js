const express = require("express");
const bodyParser = require("body-parser");
const database = require('./database/models');
const towerRoute = require('./api/tower')

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Initialize db
database.initialize();
app.use('/tower',towerRoute); //for handling tower related APIs
// set port, listen for requests
const PORT = process.env.PORT || 3041;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
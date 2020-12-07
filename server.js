const express = require("express");
const bodyParser = require("body-parser");
const database = require('./database/models');
const towerRoute = require('./api/tower')
const officeRoute = require('./api/office')
const authRoute = require('./api/auth')
const http = require('http');

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Initialize db
database.initialize();
app.use('/auth',authRoute); //for handling authentication
app.use('/towers',towerRoute); //for handling tower related APIs
app.use('/offices',officeRoute); //for handling tower related APIs

const { io } = require('./lib/socket');
const server = http.createServer(app);
io.attach(server);
// set port, listen for requests
const PORT = process.env.PORT || 3041;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;

  

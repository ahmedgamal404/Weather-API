// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
const cors = require("cors");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
const port = 3000;
app.use(express.static('website'));

// Setup Server
const server = app.listen(port, () => { console.log("Server is Working correctly on port " + port); });

// POST route to manipulate the Endpoint
app.post("/appendData", (req, res) => {
    projectData = {
        zip: req.body.zipCode,
        temp: req.body.main.temp,
        date: req.body.date,
        feelings: req.body.feelings,
        humidity: req.body.main.humidity,
        description: req.body.weather[0].description,
        name: req.body.name
    };
    res.send("POST Recieved");
});

// GET route to returen the endpoint data
app.get("/retrieveData", (req, res) => {
    res.send(projectData);
});
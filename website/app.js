/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// API url and options
const API_KEY = ""    // Input your API Key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?zip="
let units = 'metric';    // Option to get teperature in celsius unit
let lang = "en";    // Option to change the language of API retrieved data

// Getting the UI Elements
const ZIP_ELEMENT = document.querySelector("#zip");
const BUTTON = document.querySelector("#generate");
const TEMP_ELEMENT = document.querySelector("#temp");
const CONTENT_ELEMENT = document.querySelector("#content");
const FEELINGS_ELEMENT = document.querySelector("#feelings");
const DATE_ELEMENT = document.querySelector("#date");
const HUMIDITY_ELEMENT = document.querySelector("#humidity");
const NAME_ELEMENT = document.querySelector("#name");
const DESCRIPTION_ELEMENT = document.querySelector("#description");
/* END Global Variables */



/* Clint side functionality */

// Function to generate the full API url with its options
function fullUrl(zipCode) {
    let fullUrl = BASE_URL + zipCode + ",us&appid=" + API_KEY;
    function setOptions() {
        fullUrl = fullUrl + "&units=" + units + "&lang=" + lang
        return fullUrl;
    }
    fullUrl = setOptions();
    return fullUrl;
}

// Adding functionality to main Button
BUTTON.addEventListener('click', (e) => {
    getPostFunction();
});

// Main function to get and post data to / from server
function getPostFunction() {
    let zipCode = ZIP_ELEMENT.value;

    // Getting the weather information
    if (zipCode === "") {
        alert("kindly enter zip code !");
    } else {
        getData(fullUrl(zipCode)).then((data) => {

            // Validate the response
            if (data.cod === "404" || data.cod === "400" || data.cod === "401") {
                alert(data.message);
                return;
            }

            postData("/appendData", data);
        }).then((data) => {
            retrieveData("/retrieveData");
        });
    }
}

// GET response information
async function getData(url = "") {

    let zipCode = ZIP_ELEMENT.value;

    if (zipCode === "") {
        return;
    } else {
        const respone = await fetch(url);
        try {
            const newData = await respone.json();
            return newData
        } catch (error) {
            console.log(error, "sdfsdfsdfsdfsd")
        }
    }
}

// POST Fetch
const postData = async (url = '', data = {}) => {

    // // Modify the incoming data and add the data and user feelings
    data["zipCode"] = ZIP_ELEMENT.value;
    data["date"] = newDate;
    data["feelings"] = FEELINGS_ELEMENT.value;

    // Sending the data to server-side with POST request 
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });
    try {
        const newData = await response.json();
        return newData;
    } catch {
        //console.log(error);
    }

};

// Retrieving data from the Endpoint of our app local server
async function retrieveData(url) {
    const request = await fetch(url);
    try {
        const allData = await request.json();

        // Updating the UI Elements
        allData.zip ? document.querySelector("#zip").value = `${allData.zip}` : "";
        allData.date ? DATE_ELEMENT.innerHTML = `Date: ${allData.date} ` : DATE_ELEMENT.innerHTML = `Date:`;
        allData.temp ? TEMP_ELEMENT.innerHTML = `Tempetature: ${allData.temp} C&deg;` : TEMP_ELEMENT.innerHTML = `Tempetature:`;
        allData.feelings ? CONTENT_ELEMENT.innerHTML = `You feel like: ${allData.feelings} ` : CONTENT_ELEMENT.innerHTML = `You feel like:`;
        allData.description ? DESCRIPTION_ELEMENT.innerHTML = `${allData.description}` : DESCRIPTION_ELEMENT.innerHTML = ``;
        allData.name ? NAME_ELEMENT.innerHTML = `${allData.name}` : NAME_ELEMENT.innerHTML = `City`;
        allData.humidity ? HUMIDITY_ELEMENT.innerHTML = `Humidity: ${allData.humidity} %` : HUMIDITY_ELEMENT.innerHTML = `Humidity:`

    } catch (error) {
        console.log(error, "error")
    }
}

// Retrieve and Update UI with data from Endpoint when refreshing
retrieveData("/retrieveData");

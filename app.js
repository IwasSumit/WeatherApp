//jshint esversion:6 
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("front", { weather: null, error:null});
});

app.post("/", function(req, res){

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;


    https.get(url, function(response){
        const cod= response.statusCode;
        console.log(cod);
        if (cod===404) {
         res.sendFile(__dirname+"/index.html");
        }

        else{
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
            
                let place = weatherData.name;
                let country= weatherData.sys.country;
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const humidity= weatherData.main.humidity;
                const pressure= weatherData.main.pressure;
                const icon = weatherData.weather[0].icon;
        
                res.render("front",{
    
                    weather: weatherData,
                    temp: temp,
                    description: description,
                    icon: icon,
                    place: place,
                    humidity: humidity,
                    pressure: pressure,
                    country: country,
                    
              });
                
            });
        }
        
    });
});

app.listen(process.env.PORT || 8000, function(){
    console.log("Server is running on port 8000");
});
const axios = require('axios');
const express =require("express")
const {authentication}=require("../middleware/authentication")
const Redis = require('redis');


const {log}=require("../model/logger")
require('dotenv').config()
const Wrouther= express.Router()

const client = Redis.createClient({
	url: process.env.redisUrl
});

Wrouther.get('/weather/:location', authentication, (req, res) => {
  const location = req.params.location;

  
  client.get(location, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'something wrong' });
    }

    if (data) {
   
      const details = JSON.parse(data);
      return res.json({ weather: details });
    } else {
    
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.weatherapi}`;
      axios.get(url)
        .then(response => {
         
          const details = response.data;
          client.set(location, JSON.stringify(details), 'EX', 1800);
          res.json({ weather: details });
        })
        .catch(err => {
			log.error(err.message);
          console.error(err)
          res.send(err.message)
		})
	}
})
})

module.exports= {
	Wrouther
}
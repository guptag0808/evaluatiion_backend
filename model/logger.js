const winston = require("winston")
require("winston-mongodb")
require("dotenv").config()

const log= winston.createLogger({
	transports:[
		new winston.transports.MongoDB({
			level:"error",
			db:process.env.url,
			 collection: "logdetails",
			 format:winston.format.combine(
				winston.format.timestamp(),
                winston.format.json()
			 )
		})
			
	]
})
module.exports={
	log
}
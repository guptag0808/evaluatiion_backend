const jwt= require("jsonwebtoken")
require('dotenv').config()
const authentication =(req,res,next) => {
	const token= req.headers.authorization
	if(token){
		jwt.verify(token,process.env.Secret_token,(err,decoded)=>{
            if(err){
                return res.status(401).json({
                    message:err.message
                })
            }
            req.decoded=decoded
            next()
        })
	}
	}
	module.exports= {authentication}
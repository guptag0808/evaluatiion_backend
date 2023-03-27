const express= require("express")
const redis = require("redis")
const bcrypt= require("bcrypt")
const jwt= require("jsonwebtoken")
const {connection} = require("./db")
const {UserModel}=require("./model/user")
const {Wrouther}= require("./routes/weather")



const app = express()
require('dotenv').config()

app.use(express.json())
app.use("/abc",Wrouther)

const client = redis.createClient({
	url: process.env.redisUrl
})
try{
	client.connect()
}catch(err){
   
    console.log(err)
}


app.get("/",(req,res)=>{
	res.send("This is my home page")
})

app.post("/register",async(req,res)=>{
	// const user= req.body;
	const {name,email,pass}=req.body;
    try{
		bcrypt.hash(pass, 5, async(err, hash) =>{
			if(err) res.send(err.message)
			else{
               const details= new UserModel({name,email,pass:hash})
				await details.save()
				res.send({"msg":"Your Data Has Been Register"})
				

			}
		});
	}catch(err){
		res.send({"msg":"Something is wrong","error":err.message})
	}
})

// for login

app.post("/login",async(req,res)=>{
	const {email,pass}= req.body;
	
	try{
		const user= await	UserModel.find({email})
	 if(user.length>0){
		bcrypt.compare(pass, user[0].pass, (err, result)=> {
			if(result){
				var token = jwt.sign({userID: user[0]._id },process.env.Secret_token,{ expiresIn: '1h' });
				res.send({"msg":"Login SuccessFul","token":token})
			}else{
				res.send({"msg":"Wrong Password login again"})
			}
		});
		
	 }else{
		res.send({"msg":"Wrong Credentials"})
	 }
	  }catch(err){
		console.log(err.message)
	}
})

// logout 

 app.get("/logout",async(req,res)=>{
      const token= req.headers.authorization
	  if(token){
	await client.LPUSH("blacklist",JSON.stringify(token))
		res.send("Logout Successfull")
	  }else{
		res.send("login first")
	  }
})


app.listen(process.env.PORT,async()=>{
	try{
		await connection
		console.log("Connected to database")
	}catch(err){
		console.log("Something err with network connection")
	}
})
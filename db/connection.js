const mongoose = require("mongoose")
const connectionString = process.env.Database

mongoose.connect(connectionString).then(res=>{
    console.log("Mongodb connected successfully");
    
}).catch(err=>{
    console.log(`Mongodb connection failed due to : ${err}`);
    
})
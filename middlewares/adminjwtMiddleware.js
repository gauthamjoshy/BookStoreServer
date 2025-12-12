const jwt = require("jsonwebtoken")

const adminjwtMiddleware = (req, res, next) =>{
    console.log("Inside adminjwtMiddleware");
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);

    try{
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        // console.log(req.payload);
        req.role = jwtResponse.role
        if(jwtResponse.role == "admin"){
            next()
        }else{
            res.status(401).json(`Unauthorized user`)
        }
        
        
    }catch (err){
        res.status(500).json("Invalid Token", err)
    }
    
    
}

module.exports = adminjwtMiddleware
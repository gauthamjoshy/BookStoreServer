const jwt = require("jsonwebtoken")

const jwtMiddleware = (req, res, next) =>{
    console.log("Inside JWT MiddleWare");
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);

    try{
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        next()
        console.log(req.payload);
        
        
    }catch (err){
        res.status(500).json("Invalid Token", err)
    }
    
    
}

module.exports = jwtMiddleware
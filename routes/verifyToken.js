const jwt = require("jsonwebtoken");

// Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.Jwt_sec, (err,user)=>{
            if(err) res.status(403).json("Token is not Valid!");
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated!");
    }
};

// Verify Token and Authentication
const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

// Verify Token and Admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Only admin is allowed to perform these tasks!");
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt( JSON.stringify(req.body.password), process.env.Pass_sec).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch (err){
        res.status(500).json(err);
    }
})

// Login
router.post("/login", async (req, res)=>{
    try{
        // Find User by username
        const user = await User.findOne({username: req.body.username}); 
        // If user not exist
        !user && res.status(401).json("Wrong User Name")
        // Decrypt the hashed password
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.Pass_sec);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        // If Input password is wrong
        OriginalPassword !== JSON.stringify(req.body.password) && res.status(401).json("Wrong Password");

        // Creating Access Token using jsonwebtoken library
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.Jwt_sec,
            {expiresIn: "3d"}
        )

        // Response If every thing is right
        const {password, ...others} = user._doc;
        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;
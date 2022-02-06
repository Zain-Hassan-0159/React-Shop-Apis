const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth")

dotenv.config();

// DataBase Connection Mongdb
mongoose.connect(process.env.Mongo_url)
.then(()=>console.log("hurray! Database is connected"))
.catch((err)=>{console.log(err)});

// Routes
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

// Port
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend Server is running");
})
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config( { path : './config.env'});
require("./db/conn")
// const User = require("./model/userSchema");

app.use(express.json())

app.use(require("./router/auth"));

const PORT = process.env.PORT;

// const middleware = (req,res, next) => {
//     console.log(`Hello from Middleware`);
//     next();
// }

// middleware();

app.get("/", (req,res) => {
    res.send("Hello World from the server");
});

// app.get("/about", middleware, (req,res) => {
//     res.send("Hello AboutUs from the server");
// });

// app.get("/contact", (req,res) => {
//     // res.cookie("Test","Nen")
//     res.send("Hello ContactUs from the server");
// });

app.get("/signin", (req,res) => {
    res.send("Hello LogIn from the server");
});

app.get("/signup", (req,res) => {
    res.send("Hello Registration from the server");
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authenticate = require("../middleware/authenticate")
const cookieParser = require("cookie-parser");

require("../db/conn");
const User = require("../model/userSchema")

router.use(cookieParser());


router.get("/",(req,res) => {
    res.send("HEllo world from router js");
})

router.post("/register",async (req,res) => {

    const {name,email,phone,work,password,cpassword} = req.body;
    // console.log(req.body);
    // console.log(req.body.name);
    // res.json( { message:req.body } )

    if(!name || !email || !phone || !work || !password || !cpassword){
       return res.status(422).json({ error : "Pls fill the required fields"});
    }

    // User.findOne({email : email})
    // .then((userExist) => {
    //     if(userExist){
    //         return res.status(422).json({error:"Email already exists"})
    //     }
    //     const user = new User({name,email,phone,work,password,cpassword})

    //     user.save().then(() => {
    //         res.status(201).json({message : "User registered successfully"})
    //     }).catch((err) => res.status(500).json({error: "Failed to register"}));
    // }).catch((err) => {console.log(err);});

    try {
        const userExist = await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"Email already exists"})
        }
        if(password!==cpassword){
            return res.status(422).json({error:"Password does not match"})
        }
        const user = new User({name,email,phone,work,password,cpassword})
        // hashing of password
        const userRegister = await user.save();
        if(userRegister){
            return res.status(201).json({message : "User registered successfully"})
        }
        else{
           return res.status(500).json({error: "Failed to register"})
        }

    } catch(error) {
        console.log(error);
    }

})

router.post("/signin" ,async (req,res) => {

    // console.log(req.body);
    // res.json({message : "awesome"})

    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Pls fill the required fields"});
        }

        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);

        if(userLogin){
            // console.log(userLogin);
            const isMatch = await bcryptjs.compare(password,userLogin.password);
            // console.log(password);
            // console.log(userLogin.password);
            // console.log(isMatch);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            if(isMatch){
                return res.json({message : "User Signin Successfully" })
            }
            else{
                return res.status(400).json({error : "Invalid Credentials" })
            }
        }
        else{
            return res.status(400).json({error : "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error);
    }
})

router.get("/about", authenticate, (req,res) => {
    console.log("hello about us page");
    res.send(req.rootUser);
})

router.get("/getData",authenticate,(req,res) => {
    console.log("hello getData page");
    res.send(req.rootUser);
})

router.post("/contact", authenticate, async (req,res) => {

        try {
            const {name,email,phone,message} = req.body;

            if(!name || !email || !phone || !message){
                return res.json("Pls fill all the fields")
            }

            const userContact = await User.findOne({_id:req.userID})
            if(userContact){
                const userMessage = await userContact.addMessage(name,email,phone,message);
                // console.log(userMessage);
                await userContact.save();
                res.status(201).json({message:"user contact successfull"})
            }

        } catch(error) {
            console.log(error);

        }
    });

    router.get("/logout", (req,res) => {
        console.log("hello Logout page");
        res.clearCookie("jwtoken",{path:"/"})
        res.status(200).send("User Logout");
    })


module.exports = router;
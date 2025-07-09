const express = require('express');
const app = express();
const ejs = require("ejs");

const {connectMongoose, User}= require("./Database.js");
const passport = require ("passport")
const {initializingPassport} = require("./passportConfig.js");
const expressSession = require("express-session");
connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
//resave = false prevents unnecessary storage consumption
app.use(expressSession({secret: "secret", resave: false, saveUninitialized: false}));

app.set("view engine", "ejs");

app.get("/" , (req,res) => {
    res.render("index");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.get("/login", (req,res)=>{
    res.render("login");
});


app.post("/register", async (req,res)=>{
    const user = await User.findOne({username: req.body.username});
    if(user)return express.status(400).send("User already exists");
    const newUser = await User.create(req.body);

    res.status(201).send(newUser);
});

// app.post("/login", async (req,res)=>{
// });

app.listen(3000 , () => {
    console.log("Listening on http://localhost:3000");
});
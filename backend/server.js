const express = require('express');
const app = express();
const ejs = require("ejs");

const {connectMongoose, User}= require("./Database.js");
const passport = require ("passport")
const {initializingPassport, isAuthenticated} = require("./passportConfig.js");
const expressSession = require("express-session");
connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//resave = false prevents unnecessary storage consumption
app.use(expressSession({secret: "secret", resave: false,
    saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


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


// app.post("/register", async (req,res)=>{
//     const user = await User.findOne({username: req.body.username});
//     if(user)return express.status(400).send("User already exists");
//     const newUser = await User.create(req.body);

//     res.status(201).send(newUser);
// });

app.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) return res.status(400).send("User already exists");

        const newUser = await User.create(req.body);
        res.redirect("/login");
        // req.login(newUser, (err) => {
        //     if (err) return res.status(500).send(err);
        //     return res.redirect("/");
        // });

    } catch (err) {
        res.status(500).send("Something went wrong: " + err.message);
    }
});




app.post("/login", passport.authenticate("local",{failureRedirect:"/register",successRedirect:"/portal"}), async (req,res)=>{
});

app.get("/profile", isAuthenticated,(req,res)=>{
    
    //res.send(req.user);
     res.render("Profile",{user: req.user});
});
// app.get("/logout", (req,res)=> {
//     req.logout();
//     //res.redirect("/login");
//     res.send("logged out");
// });
app.post("/profile", isAuthenticated, async (req, res) => {
  // You can save this to DB or just console log for now
  console.log("User profile submitted:", req.body);

  // Optionally, update user's profile in DB
  await User.findByIdAndUpdate(req.user._id, {
    ...req.body
  });

  res.send("Profile saved successfully. You can enhance this with a redirect or dashboard.");
});

app.get("/portal", isAuthenticated,(req, res) => {
  res.render("portal",{user: req.user});
});

app.post("/choose-role", isAuthenticated, (req, res) => {
  const role = req.body.role;
  if (role === "admin") {
    return res.redirect("/admin-dashboard");
  }
  return res.redirect("/profile"); // default user dashboard
});


app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.send("Logged Out");
    // res.redirect('/');
  });
});

app.listen(3000 , () => {
    console.log("Listening on http://localhost:3000");
});
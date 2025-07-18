const express = require('express');
const app = express();
const cors = require('cors');
const { connectMongoose, User } = require('./Database.js');
const passport = require('passport');
const { initializingPassport, isAuthenticated } = require('./passportConfig.js');
const expressSession = require('express-session');
const path = require('path');

// DB connection
connectMongoose();

// Passport setup
initializingPassport(passport);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to match your React dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Auth Routes
 */

// ✅ Register User
app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name || !username.trim() || !password.trim() || !name.trim()) {
    return res.status(400).json({ message: "All fields are required and cannot be empty." });
  }

  if (/^\d/.test(username)) {
    return res.status(400).json({ message: "Email cannot start with a number." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({ username, password, name });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
});


// ✅ Login User
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || !username.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Username and password cannot be empty.' });
  }

  if (/^\d/.test(username)) {
    return res.status(400).json({ message: 'Username cannot start with a number.' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user: { name: user.name, username: user.username } });
    });
  })(req, res, next);
});

// ✅ Logout
app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

// ✅ Get Current Authenticated User
app.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Profile Routes
 */

// ✅ Save/Update Profile
app.post('/profile', isAuthenticated, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile saved successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Error saving profile' });
  }
});

// ✅ Fetch Profile
app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send full user object or sanitize if needed
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ✅ Role Chooser
app.post('/choose-role', isAuthenticated, (req, res) => {
  const { role } = req.body;
  if (role === 'admin') {
    return res.json({ redirect: '/admin' });
  }
  return res.json({ redirect: '/dashboard' });
});

/**
 * Optional: Serve React Static Build (if in production)
 */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}


// const express = require('express');
// const app = express();
// const ejs = require("ejs");

// const {connectMongoose, User}= require("./Database.js");
// const passport = require ("passport")
// const {initializingPassport, isAuthenticated} = require("./passportConfig.js");
// const expressSession = require("express-session");
// connectMongoose();

// initializingPassport(passport);

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// //resave = false prevents unnecessary storage consumption
// app.use(expressSession({secret: "secret", resave: false,
//     saveUninitialized: false}));
// app.use(passport.initialize());
// app.use(passport.session());


// app.set("view engine", "ejs");

// app.get("/" , (req,res) => {
//     res.render("index");
// });

// app.get("/register", (req, res) => {
//     res.render("register", { error: null });
// });


// app.get("/login", (req,res)=>{
//     res.render("login");
// });


// // app.post("/register", async (req,res)=>{
// //     const user = await User.findOne({username: req.body.username});
// //     if(user)return express.status(400).send("User already exists");
// //     const newUser = await User.create(req.body);

// //     res.status(201).send(newUser);
// // });

// app.post("/register", async (req, res) => {
//     const { username, password, name } = req.body;

//     // Validation
//     if (!username || !password || !name || !username.trim() || !password.trim() || !name.trim()) {
//         return res.render("register", { error: "All fields are required and cannot be empty." });
//     }

//     if (/^\d/.test(username)) {
//         return res.render("register", { error: "Email cannot start with a number." });
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
//         return res.render("register", { error: "Invalid email format." });
//     }

//     try {
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.render("register", { error: "User already exists" });
//         }

//         const newUser = await User.create({ username, password, name });
//         res.redirect("/login");
//     } catch (err) {
//         res.render("register", { error: "Something went wrong: " + err.message });
//     }
// });



// // app.post("/login", passport.authenticate("local",{failureRedirect:"/register",successRedirect:"/portal"}), async (req,res)=>{
// // });


// app.post("/login", (req, res, next) => {
//     const { username, password } = req.body;

//     // ✅ Basic input validation
//     if (!username || !password || !username.trim() || !password.trim()) {
//         return res.render("login", { error: "Username and password cannot be empty or only spaces." });
//     }

//     if (/^\d/.test(username)) {
//         return res.render("login", { error: "Username cannot start with a number." });
//     }

//     // ✅ Custom Passport callback
//     passport.authenticate("local", (err, user, info) => {
//         if (err) return next(err);

//         if (!user) {
//             return res.render("login", { error: "Invalid username or password." });
//         }

//         req.login(user, (err) => {
//             if (err) return next(err);
//             return res.redirect("/portal");
//         });
//     })(req, res, next);
// });


// app.get("/profile", isAuthenticated,(req,res)=>{
    
//     //res.send(req.user);
//      res.render("Profile",{user: req.user});
// });

// app.post("/profile", isAuthenticated, async (req, res) => {
//   // You can save this to DB or just console log for now
//   console.log("User profile submitted:", req.body);

//   // Optionally, update user's profile in DB
//   await User.findByIdAndUpdate(req.user._id, {
//     ...req.body
//   });

//   res.send("Profile saved successfully. You can enhance this with a redirect or dashboard.");
// });

// app.get("/portal", isAuthenticated,(req, res) => {
//   res.render("portal",{user: req.user});
// });

// app.post("/choose-role", isAuthenticated, (req, res) => {
//   const role = req.body.role;
//   if (role === "admin") {
//     return res.redirect("/admin-dashboard");
//   }
//   return res.redirect("/profile"); // default user dashboard
// });

// // app.get("/logout", (req,res)=> {
// //     req.logout();
// //     //res.redirect("/login");
// //     res.send("logged out");
// // });

// app.get('/logout', (req, res, next) => {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.send("Logged Out");
//     // res.redirect('/');
//   });
// });

// app.listen(3000 , () => {
//     console.log("Listening on http://localhost:3000");
// });
/**
 * Start Server
 */
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

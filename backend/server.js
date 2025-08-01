const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const expressSession = require('express-session');
const passport = require('passport');
const jwt =require('jsonwebtoken');

const { connectMongoose, User, Research } = require('./Database.js');// <-- include Research model
const { initializingPassport, isAuthenticated } = require('./passportConfig.js');

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
app.use('/uploads', express.static('uploads'));
app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// UPLOADS
const upload = multer({
  dest: 'uploads/', // folder for storing uploaded files
  limits: { fileSize: 10 * 1024 * 1024 } // limit file size to 10MB
})

/**
 * Auth Routes
 */
app.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, "process.env.JWT_SECRET", { expiresIn: "7d" });

    res.redirect("http://localhost:3000/signin?token="+token);
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ msg: "Logged Out" })
  });
});
// Register User
app.post("/register", async (req, res) => {
  const { username, password, name,role = 'student' } = req.body;

  if (!username || !password || !name || !username.trim() || !password.trim() || !name.trim()) {
    return res.status(400).json({ message: "All fields are required and cannot be empty." });
  }

  if (/^\d/.test(username)) {
    return res.status(400).json({ message: "Email cannot start with a number." });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({ username, password, name,role });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
});


// Login User
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
//gap in strings
  if (!username || !password || !username.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Username and password cannot be empty.' });
  }

  if (/^\d/.test(username)) {//rejects
    return res.status(400).json({ message: 'Username cannot start with a number.' });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user: { name: user.name,role:user?.role, username: user.username } });
    });
  })(req, res, next);
});

// Logout
app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Get Current Authenticated User
app.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

/**
 * Profile Routes
 */

// Save/Update Profile
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

    res.json({ message: 'Profile saved successfully', user: updatedUser, redirect: '/userdashboard' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Error saving profile' });
  }
});

// Fetch Profile
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

// Role Chooser
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

app.post('/upload-research', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    const { title, text, visibility } = req.body;
    const filePath = req.file ? req.file.path : null;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title?.trim() && !text?.trim()) {
      return res.status(400).json({ message: 'Title or text is required.' });
    }

    const newResearch = new Research({
      user: req.user._id,
      authorName: req.user.firstName,
      title,
      text,
      filePath,
      imageUrl,
      visibility,
    });

    await newResearch.save();

    res.status(201).json({
      _id: newResearch._id,
      title: newResearch.title,
      text: newResearch.text,
      imageUrl: newResearch.imageUrl,
      authorName: newResearch.authorName,
      createdAt: newResearch.createdAt,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading research' });
  }
});

// All public research
app.get('/research/public', async (req, res) => {
  try {
    const publicResearches = await Research.find({ visibility: 'public' }).populate('user', 'name');
    res.json(publicResearches);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Error fetching public research' });
  }
});

// All uploads by logged-in user
app.get('/research/mine', isAuthenticated, async (req, res) => {
  try {
    const myResearches = await Research.find({ user: req.user._id });
    res.json(myResearches);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Error fetching your research' });
  }
});

// Delete a research entry
app.delete('/research/:id', isAuthenticated, async (req, res) => {
  try {
    const research = await Research.findById(req.params.id);

    if (!research) {
      return res.status(404).json({ message: 'Research not found' });
    }

    // Check if the logged-in user owns the research
    if (!research.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this research' });
    }

    // Delete the file if it exists
    if (research.filePath && fs.existsSync(research.filePath)) {
      fs.unlinkSync(research.filePath);
    }

    // Remove from MongoDB
    await Research.findByIdAndDelete(req.params.id);

    res.json({ message: 'Research deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Error deleting research' });
  }
});

app.post('/user/update', isAuthenticated, upload.single('profilePic'), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePic = req.file?.filename;
  const updatedFields = {};

  if (username) updatedFields.username = username;
  if (email) updatedFields.email = email;
  if (profilePic) updatedFields.profilePic = profilePic;

  if (password) {
    try {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    } catch (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Updated successfully!', user: updatedUser });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Get all users (for admin dashboard)
app.get('/api/users', isAuthenticated, async (req, res) => {
  try {
    // Only allow admin to access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find({}, 'name username email role createdAt');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// DELETE user (admin only)
app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also optionally delete their associated research
    await Research.deleteMany({ user: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ADMIN: Get all publications
app.get('/api/research', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const allResearch = await Research.find().populate('user', 'name');
    res.json(allResearch);
  } catch (err) {
    console.error('Error fetching publications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Delete any publication
app.delete('/api/research/:id', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const research = await Research.findById(req.params.id);
    if (!research) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    // Delete associated file if any
    if (research.filePath && fs.existsSync(research.filePath)) {
      fs.unlinkSync(research.filePath);
    }

    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Publication deleted successfully' });
  } catch (err) {
    console.error('Error deleting publication:', err);
    res.status(500).json({ message: 'Failed to delete publication' });
  }
});

// Admin: Get today's user signups
app.get('/api/todays-signups', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const users = await User.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json(users);
  } catch (err) {
    console.error('Error fetching today\'s signups:', err);
    res.status(500).json({ message: 'Server error' });
  }
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
/**
 * Start Server
 */
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

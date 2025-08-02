const bcrypt= require('bcryptjs');
const GoogleStrategy  =require("passport-google-oauth20");
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./Database.js');
exports.initializingPassport= (passport)=>{
    passport.use(new LocalStrategy(async(username,password, done)=>{
        try {
        const user = await User.findOne({username});
        if(!user) {console.log("User not found"); return done(null,false);}
        // if(user.password != password) {console.log("Incorrect password"); return done(null,false);}
        const match = await bcrypt.compare(password,user.password);
        if(match)
            return done(null, user);
        else
            return done(null,false);
        } catch (err) {
            return done(err, false);
        }
    }));
   passport.use(
  new GoogleStrategy(
    {
        clientID: "8499039408-k46u9s027kfpogv1v4561o3ajsmja9on.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5000/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract the email and name from Google profile
        const username = profile.emails[0].value;
        const name = profile.displayName;
        const role = 'student'; // default role

        // Find existing user or create new one
        let user = await User.findOne({ username });

        if (!user) {
          user = await User.create({
            email:username,
            username,
            name,
            password: '', // optional, since Google login doesn't use it
            role,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

    passport.serializeUser((user,done) => {
        done(null, user.id)
    });
    passport.deserializeUser(async(id,done)=>{
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error,false);
        }
    });
};

exports.isAuthenticated =(req,res,next)=>{
    if(req.user) return next();
    res.redirect("/login");
};
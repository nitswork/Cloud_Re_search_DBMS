const LocalStrategy = require('passport-local').Strategy;
const {User} = require('./Database.js');
exports.initializingPassport= (passport)=>{
    passport.use(new LocalStrategy(async(username,password, done)=>{
        try {
            const user = await User.findOne({username});
        if(!user) {console.log("User not found"); return done(null,false);}
        if(user.password != password) {console.log("Incorrect password"); return done(null,false);}
        return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }));
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
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
exports.connectMongoose = () => {
    mongoose.connect('mongodb://localhost:27017/passport')
        .then((e) => console.log(`Connected to MongoDB: ${e.connection.host}`))
        .catch((e) => console.log(e));
};

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // All new users default to 'user'
    }
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
exports.User = mongoose.model("User", userSchema);

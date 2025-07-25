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
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String,
    state: String,
    university: String,
    institute: String,
    department: String,
    role: {
        type: String,
        enum: ['admin','student', 'lawyer', 'doctor', 'medical_researcher', 'scientific_researcher', 'mathematician'],
        required: true,
        default: 'student'
    },
    // accessLevel: {
    // type: String,
    // enum: ['user', 'admin'],
    // default: 'user'
    // }
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

const researchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true },
  title: { type: String, required: true },
  authorName:{ type: String },
  text: { type: String },
  filePath: { type: String },
  imageUrl:{ type: String },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  createdAt: { type: Date, default: Date.now }
});

exports.Research = mongoose.model("Research", researchSchema);
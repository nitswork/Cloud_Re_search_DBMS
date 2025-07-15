const mongoose = require("mongoose");

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

exports.User = mongoose.model("User", userSchema);

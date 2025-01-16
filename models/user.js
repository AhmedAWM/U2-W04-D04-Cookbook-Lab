const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pantry: [foodSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
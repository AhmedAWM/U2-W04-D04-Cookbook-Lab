// Imports
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Models
const User = require("../models/user");

// Routes
router.get('/signin', (request, response) => {
    response.render('../auth/signin.ejs');
});

router.get('/signup', (request, response) => {
    response.render('../auth/signup.ejs')
});

// Signup - Create new user
router.post('/signup', async (request, response) => {
    try {
        const inputs = request.body;
        const userExists = await User.findOne({ email: inputs.email });

        // Check if user exists
        if(userExists) {
            response.send("User already exists");
            return;
        }

        // If user does not exists, create new user
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(inputs.password, 11);
        inputs.password = hashedPassword;

        // Create the user
        await User.create(inputs);

        // Redirect to signin page
        response.redirect('/auth/signin');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
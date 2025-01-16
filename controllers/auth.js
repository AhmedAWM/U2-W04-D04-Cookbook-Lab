// Imports
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Models
const User = require("../models/user");

// Routes
router.get("/signin", (request, response) => {
  if (request.session.user) {
    response.redirect("../../"); // Go to homepage
  } else {
    response.render("../auth/signin.ejs", { user: null });
  }
});

router.get("/signup", (request, response) => {
  if (request.session.user) {
    response.redirect("../../"); // Go to homepage
  } else {
    response.render("../auth/signup.ejs", { user: null });
  }
});

// Signup - Create new user
router.post("/signup", async (request, response) => {
  try {
    const signupInfo = request.body;
    const userExists = await User.findOne({ email: signupInfo.email });

    // Check if user exists
    if (userExists) {
      response.send("User already exists");
      return;
    }

    // If user does not exists, create new user
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(signupInfo.password, 11);
    signupInfo.password = hashedPassword;

    // Create the user
    await User.create(signupInfo);

    // Redirect to signin page
    response.redirect("/auth/signin");
  } catch (e) {
    console.log(e);
  }
});

// Signin
router.post("/signin", async (request, response) => {
  try {
    const signinInfo = request.body;
    const userExists = await User.findOne({ email: signinInfo.email });

    // Check if user exists
    if (!userExists) {
      response.send("Login failed. Please try again.");
      return;
    }

    // Check if password is correct
    const isValidPassword = await bcrypt.compareSync(
      signinInfo.password,
      userExists.password
    );

    if (!isValidPassword) {
      response.send("Login failed. Please try again.");
      return;
    }

    // If user exists and password is correct, create login session
    request.session.user = {
      name: userExists.name,
      email: userExists.email,
      _id: userExists._id,
    };

    response.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Signout
router.get("/signout", (request, response) => {
  request.session.destroy();
  response.redirect("signin");
});

module.exports = router;

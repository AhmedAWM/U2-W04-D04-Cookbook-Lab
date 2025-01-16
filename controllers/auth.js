// Imports
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Models
const User = require("../models/user");

// Routes
router.get('/', (request, response) => {
    response.render('../auth/signin.ejs');
});

module.exports = router;
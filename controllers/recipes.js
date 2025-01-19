// Imports
const express = require('express');
const router = express.Router();

// Models
const Recipes = require('../models/recipe');

// View all recipes
router.get('/', async (request, response) => {
    try {
        if(request.session.user) {
            const recipes = await Recipes.find();
            response.render('../recipes/.ejs', { recipes, recipes: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
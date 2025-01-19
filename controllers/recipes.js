// Imports
const express = require('express');
const router = express.Router();

// Models
const User = require('../models/user');
const Recipe = require('../models/recipe');

// View all recipes
router.get('/all', async (request, response) => {
    try {
        if(request.session.user) {
            const recipes = await Recipe.find( { owner: request.session.user._id });
            response.render('../recipes/recipes.ejs', { recipes: recipes, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// View my recipes only
router.get('/myrecipes', async (request, response) => {
    try {
        if(request.session.user) {
            const recipes = await Recipe.find( { owner: request.session.user._id });
            console.log(recipes);
            response.render('../recipes/myRecipes.ejs', { recipes: recipes, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
})

// Add recipe page
router.get('/myrecipes/add', async (request, response) => {
    try {
        if(request.session.user) {
            const user = await User.findById(request.session.user._id);
            const pantries = user.pantry;
            console.log(pantries);
            response.render('../recipes/add.ejs', { pantries: pantries, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Add recipe
router.post('/myrecipes/add', async (request, response) => {
    try {
        if(request.session.user) {
            const recipe = await Recipe.create(request.body);
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Edit my recipes
router.get('/myrecipes/:id/edit', async (request, response) => {
    try {
        if(request.session.user) {
            const recipe = await Recipe.findById(request.params.id);
            response.render('../recipes/edit.ejs', { recipe: recipe, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
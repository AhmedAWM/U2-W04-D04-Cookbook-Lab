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
            const allRecipes = await Recipe.find();
            const recipes = [];

            for(let i = 0; i < allRecipes.length; ++ i) {
                const owner = await User.findById(allRecipes[i].owner);
                recipes.push({_id: allRecipes[i]._id, name: allRecipes[i].name, instructions: allRecipes[i].instructions, image: allRecipes[i].image, owner: owner.name, ingredients: allRecipes[i].ingredients });
            }

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
            const allRecipes = await Recipe.find( { owner: request.session.user._id });
            const recipes = [];

            for(let i = 0; i < allRecipes.length; ++ i) {
                const owner = await User.findById(allRecipes[i].owner);
                recipes.push({_id: allRecipes[i]._id, name: allRecipes[i].name, instructions: allRecipes[i].instructions, image: allRecipes[i].image, owner: owner.name, ingredients: allRecipes[i].ingredients });
            }

            response.render('../recipes/myRecipes.ejs', { recipes: recipes, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// View recipe
router.get('/:id', async (request, response) => {
    try {
        if(request.session.user) {
            const recipe = await Recipe.findById(request.params.id);
            const owner = await User.findById(recipe.owner);
            const ingredients = recipe.ingredients;

            const details = {
                _id: recipe._id,
                name: recipe.name,
                instructions: recipe.instructions,
                image: recipe.image,
                owner: owner,
                ingredients: ingredients
            }

            console.log("Recipe owner from JS: ", details.owner._id);
            console.log("My ID: ", request.session.user._id);

            if(details.owner._id.toString() === request.session.user._id) {
                console.log("This is true");
            } else {
                console.log("This is false");
            }

            response.render('../recipes/recipe.ejs', { details: details, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Add recipe page
router.get('/myrecipes/add', async (request, response) => {
    try {
        if(request.session.user) {
            const user = await User.findById(request.session.user._id);
            const pantries = user.pantry;
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
            request.body.owner = request.session.user;
            const recipe = await Recipe.create(request.body);
            response.redirect("/recipes/myrecipes");
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Edit my recipes page
router.get('/:id/edit', async (request, response) => {
    try {
        if(request.session.user) {
            const recipe = await Recipe.findById(request.params.id);
            const pantries = await User.findById(request.session.user._id);
            response.render('../recipes/edit.ejs', { recipe: recipe, pantries: pantries.pantry, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Update recipe
router.post('/:id/edit', async (request, response) => {
    try {
        if(request.session.user) {
            const recipe = await Recipe.findByIdAndUpdate(request.params.id, request.body);

            response.redirect('/recipes/myrecipes');
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Delete recipe
router.delete('/:id/delete', async (request, response) => {
    try {
        if(request.session.user) {
            await Recipe.findByIdAndDelete(request.params.id);
            response.redirect('/recipes/myrecipes');
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
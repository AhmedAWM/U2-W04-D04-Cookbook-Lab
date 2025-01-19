// Imports
const express = require('express');
const router = express.Router();

// Models
const User = require('../models/user');

// View all foods
router.get('/', async (request, response) => {
    try {
        if(request.session.user) {
            const user = await User.findById(request.session.user._id);
            const foods = user.pantry;
            response.render('../food/foods.ejs', { foods: foods, user: request.session.user });
        } else {
            response.redirect("/");
        }
    } catch (e) {
        console.log(e);
    }
});

// Add new food page
router.get('/newfood', (request, response) => {
    if(request.session.user) {
        response.render('../food/new-food.ejs', { user: request.session.user });
    } else {
        response.redirect('/');
    }
});

// Add food
router.post('/newfood', async (request, response) => {
    try {
         // Find and update the user with foods
         const user = await User.findById(request.session.user._id);
         user.pantry.push(request.body);
         await user.save();

         // Reditect to foods main page
         response.redirect('/food');
    } catch (e) {
        console.log(e);
    }
});

// Delete food
router.delete('/:id/delete', async (request, response) => {
    try {
        const user = await User.findById(request.session.user._id);
        user.pantry.pull(request.params.id);
        await user.save();

        // Reditect to foods main page
        response.redirect('/food');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  }],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
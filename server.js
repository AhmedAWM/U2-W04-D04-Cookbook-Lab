// Imports
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const session = require("express-session");
const authController = require("./controllers/auth");

// Inizializations
const app = express();
dotenv.config();

// Models
const User = require("./models/user");

// Middlewares
app.use(express.static("public")); // Load images and static files in pages with "public" directory
app.use(express.urlencoded({ extended: false })); // Allow to transfer the objects to another route through request.body
app.use(methodOverride("_method")); // Allow PUT/DELETE in forms
app.use(
  session({
    // SESSION_SECRET from .env
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("Error connecting to DB", e);
  });

// Routes
app.use("/auth", authController);

// Homepage
app.get("/", (request, response) => {
  if (request.session.user) {
    response.render("home.ejs", { user: request.session.user });
  } else {
    response.render("../auth/signin.ejs", { user: null });
  }
});

// If wrong path, redirect to error 404 page
app.use((request, response) => {
  response.render("404.ejs", { route: request.originalUrl });
});

// Start the server on port 3000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

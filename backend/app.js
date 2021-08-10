// chargement des modules
const express = require("express");

// Pour utiliser la BDD
const mongoose = require("mongoose");
// Pour avoir le chemin de notre fichier (lors des chargements d'images)
const path = require("path");

// helmet pour les vulvérabilités Helmet helps you secure your Express apps by setting various HTTP headers.
const helmet = require("helmet");
// Pour limiter les demandes répétées aux API
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000,
	max: 3, // limit each IP to 3 requests per windowMs
});

//declaration des routes
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

// dotenv pour masquer les informations de la BDD (variable environnement)
require("dotenv").config();

// Conneexion à la BDD et fonction à executer
mongoose
	.connect(process.env.DB_URI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// initialisation
const app = express();

//  apply to all requests
app.use("/api/auth/login", limiter);

// ***************Cross Origin Resource Sharing*******************//
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Body Parser Middleware
app.use(express.json());

// Permet de sécuriser contre les données non fiables entre sites
app.use(helmet());

// Middleware pour la location des images
app.use("/images", express.static(path.join(__dirname, "images")));

// routes
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

//  on exporte l'app
module.exports = app;

// on importe mongoose pour créer le schema
const mongoose = require("mongoose");

// on utilise la fonction Schema pour passer au package mongoose un objet avec les champs
const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, min: 1, max: 10, required: true },
	likes: { type: Number, required: false },
	dislikes: { type: Number, required: false },
	usersLiked: { type: [String], required: false },
	usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.model("Sauce", sauceSchema);

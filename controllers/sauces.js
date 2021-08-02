const Sauce = require("../models/sauce");
const fs = require("fs");

// Middleware pour creer une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	// on crée une instance de notre modèle
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	// on enregistre l'objet dans la base
	sauce
		.save()
		.then(() => {
			res.status(201).json({
				message: "Sauce ajoutée!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// Middleware pour avoir une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};

exports.modifySauce = (req, res, next) => {
	let sauceObject = {};
	if (req.file) {
		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
			fs.unlinkSync(`images/${sauce.imageUrl.split("/images/")[1]}`);
			console.log(sauce.imageUrl);
			sauceObject = {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
			};
			console.log(sauceObject.imageUrl);
			Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
				.then(() => {
					res.status(200).json({
						message: "Sauce modifiée!",
					});
				})
				.catch((error) => {
					res.status(400).json({
						error: error,
					});
				});
		});
	} else {
		sauceObject = { ...req.body };
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => {
				res.status(200).json({
					message: "Sauce modifiée!",
				});
			})
			.catch((error) => {
				res.status(400).json({
					error: error,
				});
			});
	}
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }) //on cherche la sauce dont l'id correspont à celui de la BDD
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				//URL d'image contient un segment /images/ on sépare le nom de fichier
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "sauce supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// Définit le statut "j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce.
// Si j'aime = 0,l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
// Si j'aime =-1, l'utilisateur n'aime pas la sauce.
// L'identifiant de	l'utilisateur doit être	ajouté ou supprimé du tableau approprié, en gardant une trace de ses préférences et en	l'empêchant d'aimer ou	de ne pas aimer la	même sauce plusieurs	fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".

exports.likeSauce = (req, res, next) => {
	switch (req.body.like) {
		case 1: //cas: req.body.likes = 1
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					// on recherche la sauce avec le _id présent dans la requête
					$inc: { likes: 1 }, // incrémentaton des likes
					$push: { usersLiked: req.body.userId }, // on ajoute l'utilisateur dans le array usersLiked.
				}
			)

				.then(() => {
					res.status(201).json({ message: "like enregistré." });
				})
				.catch((error) => {
					res.status(400).json({ error });
				}); //code 400: bad request
			break;
		case 0: //cas: req.body.likes = 0
			Sauce.findOne({ _id: req.params.id })
				.then((sauce) => {
					if (sauce.usersLiked.find((user) => user === req.body.userId)) {
						// on cherche si l'utilisateur est déjà dans le tableau usersLiked
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								// si oui, on va mettre à jour la sauce avec le _id présent dans la requête
								$inc: { likes: -1 }, // on décrémente la valeur des likes de 1 (soit -1)
								$pull: { usersLiked: req.body.userId }, // on retire l'utilisateur du tableau.
							}
						)
							.then(() => {
								res.status(201).json({ message: "like enlevé." });
							}) //code 201: created
							.catch((error) => {
								res.status(400).json({ error });
							});
					}
					if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { dislikes: -1 },
								$pull: { usersDisliked: req.body.userId },
							}
						)
							.then(() => {
								res.status(201).json({ message: "dislike enlevé." });
							})
							.catch((error) => {
								res.status(400).json({ error });
							});
					}
				})
				.catch((error) => {
					res.status(404).json({ error });
				});
			break;

		case -1: //cas: req.body.disLike = 1
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					// on recherche la sauce avec le _id présent dans la requête
					$inc: { dislikes: 1 }, // on décremente de 1 la valeur de dislikes.
					$push: { usersDisliked: req.body.userId }, // on rajoute l'utilisateur à l'array usersDiliked.
				}
			)
				.then(() => {
					res.status(201).json({ message: "dislike enregistré." });
				}) // code 201: created
				.catch((error) => {
					res.status(400).json({ error });
				}); // code 400: bad request
			break;
		default:
			console.error("bad request");
	}
};

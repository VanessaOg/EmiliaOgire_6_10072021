module.exports = (req, res, next) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
		if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(req.body.password)) {
			next();
		} else {
			res.status(400).json({
				message:
					"Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une minuscule et une majuscule",
			});
		}
	} else {
		res.status(400).json({ message: "Le login doit être une adresse email valide !" });
	}
};

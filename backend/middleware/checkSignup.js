module.exports = (req, res, next) => {
	const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	if (req.body.email == null || req.body.password == null) {
		return res.status(400).json({ error: "Les champs doivent être remplis" });
	}
	// console.log(req.body);
	if (EMAIL_REGEX.test(req.body.email)) {
		if (PASSWORD_REGEX.test(req.body.password)) {
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

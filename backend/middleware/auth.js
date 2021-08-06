const jwt = require("jsonwebtoken");

//Format du token
// Authorization : Bearer <access_token>

// Fonction pour verifier le token
module.exports = (req, res, next) => {
	try {
		// on recupere le header du token, on le split pour recuperer l'access_token
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		const userId = decodedToken.userId;
		req.body.userIdFromToken = userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};

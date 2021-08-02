const Sauce = require("../models/sauce");
const permission = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			if (req.body.userIdFromToken == sauce.userId) {
				next();
			} else {
				return res.status(403).json("Vous n'avez pas la permission");
			}
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};
module.exports = permission;

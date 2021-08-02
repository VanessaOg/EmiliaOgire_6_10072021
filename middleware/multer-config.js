// on importe multer qui permet de loader les fichiers entrants
const multer = require("multer");

// on définit le format des images
const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

// création d'un objet de configuration pour indiquer à multer où enregister les images
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_"); //on change le nom d'origine
		const extension = MIME_TYPES[file.mimetype];

		callback(null, name + Date.now() + "." + extension); // nom complet du fichier
	},
});

module.exports = multer({ storage }).single("image");

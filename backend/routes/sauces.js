// Le router contient la logique routing appliquée

const express = require("express");
const router = express.Router();

// on importe les middleware dont on a besoin
// Le middleware auth servira à sécuriser
const auth = require("../middleware/auth");
// multer pour la gestion des images
const multer = require("../middleware/multer-config");

const permission = require("../middleware/permission");

// on importe le controller
const saucesCtrl = require("../controllers/sauces");

//
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, permission, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, permission, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;

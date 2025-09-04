const express = require("express");
const { addFavorite, removeFavorite, listFavorites } = require("../controller/favorite.controller");

const router = express.Router();

router.post("/favorites/add", addFavorite);
router.post("/favorites/remove", removeFavorite);
router.get("/favorites/list", listFavorites);

module.exports = router;



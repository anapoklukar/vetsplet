const express = require("express");
const router = express.Router();
const ctrlLogin = require("../controllers/login");
const ctrlLoginStranka = require("../controllers/loginStranka");
const ctrlLoginVeterinar = require("../controllers/loginVeterinar");
const ctrlRegestriranUporabnik = require("../controllers/registriraniUporabnik");
const ctrlVeterinar = require("../controllers/veterinar");
router.get("/", ctrlLogin.login);
router.get("/login", ctrlLogin.login);
router.get("/loginStranka", ctrlLoginStranka.loginStranka);
router.get("/loginVeterinar", ctrlLoginVeterinar.loginVeterinar);
router.get(
  "/registriraniUporabnik",
  ctrlRegestriranUporabnik.registriraniUporabnik,
);
router.get("/veterinar", ctrlVeterinar.veterinar);
module.exports = router;

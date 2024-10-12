const apiServer =
  process.env.NODE_ENV === "production"
    ? "https://vetsplet.fly.dev"
    : "http://localhost:" + (process.env.PORT || 3000);
const axios = require("axios").create({ baseURL: apiServer, timeout: 5000 });

const registriraniUporabnik = (req, res) => {
  res.render("registriraniUporabnik");
};

module.exports = {
  registriraniUporabnik,
};

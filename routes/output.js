var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("output", { title: "Efata 1.0" });
});

module.exports = router;

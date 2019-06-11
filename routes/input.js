var express = require("express");
var multer = require("multer");
var csv = require("csv-parser");
var router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});

router.post("/", upload.single("file"), (req, res) => {
  if (req.file.mimetype != "text/csv") {
    res.status(402).send("Error: spatny typ souboru");
  }
  const bufferContent = req.file.buffer.toString();
  console.log(req.file.mimetype);
  res.status(200).json({ bufferContent });
});

module.exports = router;

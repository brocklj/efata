import express from "express";
import { getRepository } from "typeorm";
import multer from "multer";
import parse from "csv-parse/lib/sync";
import { Record } from "../model/Record";
import RecordGenerator from "../utils/RecordGenerator";
var router = express.Router();

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});

router.post("/", upload.single("file"), async (req, res) => {
  const buffer = req.file.buffer.toString();

  const output = parse(`"code","time","date","reader"\r\n` + buffer, {
    columns: true,
    skip_empty_lines: true
  });

  const rg = new RecordGenerator();
  var records = rg.processData(output);
  console.log(output);
  console.log(records);

  const postRepository = getRepository(Record);
  await postRepository.save(records);
  if (!records.length) {
    res.status(400).send("Chybný soubor");
  }

  res.status(200).json(records);
});

module.exports = router;

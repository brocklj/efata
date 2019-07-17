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
  try {
    const buffer = req.file.buffer.toString();

    const output = parse(`"code","time","date","reader"\r\n` + buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const rg = new RecordGenerator();
    var records = rg.processData(output);

    const postRepository = getRepository(Record);

    for (let i in records) {
      let record = records[i];
      try {
        await postRepository.save(record);
      } catch (error) {
        console.log(error);
      }
    }
    return res.status(200).json(records);
  } catch (error) {
    console.log(error);
    let message;
    switch (error.code) {
      case "23505":
        message =
          "V souboru jsou duplicitní záznamy, které se shodují s databazí.";
        break;
      default:
        message = "Chybný soubor\n\n";
        message += error.message;
    }
    return res.status(400).send(message);
  }
});

module.exports = router;

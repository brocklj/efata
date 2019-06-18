var express = require("express");
var typeorm = require("typeorm");
var router = express.Router();
var Record = require("../model/Record").Record;
var timeFormat = require("../utils/timeFormat");

/* GET home page. */
router.get("/", async function(req, res, next) {
  const manager = typeorm.getManager();
  const records = await manager.find(Record);
  const out = processStat(records);
  res.render("output", { title: "Efata 1.0", out });
});

function processStat(records) {
  return records.map(r => {
    return {
      name: r.name,
      totalTime: timeFormat.formatTimeDiff(r.timeDiff),
      client: r.client,
      reader: r.reader
    };
  });
}

module.exports = router;

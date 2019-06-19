var express = require("express");
var typeorm = require("typeorm");
var router = express.Router();
var Record = require("../model/Record").Record;
var timeFormat = require("../utils/timeFormat");

/* GET home page. */
router.get("/", async function(req, res, next) {
  const { start_date, end_date } = req.query;
  const manager = typeorm.getManager();
  const records = await manager.query(
    `SELECT name, client, reader, SUM("timeDiff") as "timeDiff", COUNT(*) as "count"
    FROM public.record 
    ${start_date || end_date ? `WHERE` : ``} ${
      start_date
        ? `record."start" > TO_DATE('${start_date}', 'YYYY-MM-DD')`
        : ``
    } ${start_date && end_date ? `AND` : ``} ${
      end_date ? `record."end" < TO_DATE('${end_date}', 'YYYY-MM-DD')` : ``
    } 
    GROUP BY  record.client, record.name, record.reader   
    ORDER BY client, reader ASC;`
  );
  const out = processStat(records);

  res.render("output", { title: "Efata 1.0", out });
});

function processStat(records) {
  return records.map(r => {
    return {
      name: r.name,
      totalTime: timeFormat.formatTimeDiff(r.timeDiff),
      client: r.client,
      reader: r.reader,
      count: r.count
    };
  });
}

module.exports = router;

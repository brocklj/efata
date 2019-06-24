var express = require("express");
var typeorm = require("typeorm");
var router = express.Router();
var Record = require("../model/Record").Record;
var timeFormat = require("../utils/timeFormat");

/* GET home page. */
router.get("/", async function(req, res, next) {
  let start_date;
  let end_date;
  start_date = req.start_date;
  end_date = req.end_date;

  if (!(start_date && end_date)) {
    var tomorrow = new Date();
    tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);
    start_date = formatDate(new Date().setDate(new Date().getDate() - 30));
    end_date = formatDate(new Date(tomorrow));
  }
  const manager = typeorm.getManager();
  const records = await manager.query(
    `SELECT name, client, reader, SUM("timeDiff") as "timeDiff", COUNT(*) as "count"
    FROM public.record 
    ${start_date || end_date ? `WHERE` : ``} ${
      start_date ? `record."date" > TO_DATE('${start_date}', 'YYYY-MM-DD')` : ``
    } ${start_date && end_date ? `AND` : ``} ${
      end_date ? `record."date" < TO_DATE('${end_date}', 'YYYY-MM-DD')` : ``
    } 
    GROUP BY  record.client, record.name, record.reader   
    ORDER BY client, reader ASC;`
  );
  const out = processStat(records);

  res.render("output", { title: "Efata 1.0", out, start_date, end_date });
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

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
module.exports = router;

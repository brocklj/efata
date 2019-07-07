var express = require("express");
var typeorm = require("typeorm");
var router = express.Router();
var Record = require("../model/Record").Record;
var timeFormat = require("../utils/timeFormat");
import { clientCodes } from "../utils/RecordGenerator";

/* GET home page. */
router.get("/", async function(req, res, next) {
  let start_date;
  let end_date;
  start_date = req.query.start_date;
  end_date = req.query.end_date;
  let client = req.query.client;
  const regex = /\d{4}-([0]{1}[0-9]{1}|[1]{1}[0-2]{1})-([0]{1}[0-9]{1}|[1-3]{1}[0-9])\s\d{2}:\d{2}:\d{2}/;
  if (
    start_date &&
    start_date &&
    !(start_date.match(regex) && end_date.match(regex))
  ) {
    res.redirect("/output");
  }

  if (!(start_date && end_date)) {
    start_date =
      formatDate(new Date().setDate(new Date().getDate())) + " 07:00:00";
    end_date =
      formatDate(new Date().setDate(new Date().getDate() + 1)) + " 06:59:59";
  }
  const manager = typeorm.getManager();
  const records = await manager.query(
    `SELECT name, reader, SUM("timeDiff") as "timeDiff", COUNT(*) as "count"
    FROM public.record 
    ${start_date || end_date ? `WHERE` : ``} ${
      start_date
        ? `record."date" >= TO_TIMESTAMP('${start_date}', 'YYYY-MM-DD HH24:MI:SS')`
        : ``
    } ${start_date && end_date ? `AND` : ``} ${
      end_date
        ? `record."date" <= TO_TIMESTAMP('${end_date}', 'YYYY-MM-DD HH24:MI:SS')`
        : ``
    } 
    ${client ? `AND record."client" = '${client}'` : ``}
    GROUP BY  record.name, record.reader   
    ORDER BY reader ASC;`
  );
  const out = processStat(records);

  res.render("output", {
    title: "Efata 1.0",
    out,
    start_date,
    end_date,
    clientCodes,
    client
  });
});

function processStat(records) {
  return records.map(r => {
    return {
      name: r.name,
      totalTime: timeFormat.formatTimeDiff(r.timeDiff),
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

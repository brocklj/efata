var express = require("express");
var multer = require("multer");
var parse = require("csv-parse/lib/sync");
var Record = require("../model/Record").Record;
var typeorm = require("typeorm");
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

  var records = runProcessing(output);

  let { getRepository } = typeorm;

  const postRepository = getRepository(Record);
  const toSave = [];
  for (let i = 0; i < records.length; ++i) {
    let d = records[i];
    let client = getClient(output, d);
    let record = new Record();
    record.name = d.name;
    record.date = d.date;
    record.timeDiff = d.timeDiff;
    record.reader = d.reader;
    record.client = client;
    toSave.push(record);
  }
  await postRepository.save(toSave);

  res.status(200).json(records);
});

var values;

var START = [
  "1A Ubytovani 1",
  "1A Stravovani 2",
  "1A Pece o osobu 3",
  "1A Osobni hygiena 4",
  "1A Spolecenske prostredi 5",
  "1A Socialni terapie 6",
  "1A Aktivizacni cinnosti 7",
  "1A Prava, zajmy 8",
  "1A Planovani sluzby 9",
  "Jednani se zajemcem 0"
];

var END = [
  "1A Ubyt kon 1",
  "1A Strav kon 2",
  "1A Pece kon 3",
  "1A Osob hyg kon 4",
  "1A Spol prost kon 5",
  "1A Soc ter kon 6",
  "1A Aktiv cin kon 7",
  "1A Prava, zajmy kon 8",
  "1A Plan sluzby kon 9",
  "Jednani se zaj kon 0"
];
function runProcessing(data) {
  var waiting = [];

  var output = [];

  var stat = {};

  function processData(input) {
    for (var i = 0; input.length > i; i++) {
      var data = input[i];

      var name = data.code;

      var rawDateTime = data.date + " " + data.time;
      var reader = data.reader;

      var date = getDate(data.date, data.time);

      var inputObj = {
        name: name,
        date: date,
        rawDateTime: rawDateTime,
        reader: reader
      };
      if (isNewStarted(name)) {
        waiting.push(inputObj);
      } else {
        processFinished(inputObj);
      }
    }

    return output;
  }

  function isNewStarted(name) {
    return START.includes(name);
  }

  function processFinished(endItem) {
    var index = END.indexOf(endItem.name);
    var startKey = START[index];
    finishWaiting(startKey, endItem);
  }

  function finishWaiting(startKey, endItem) {
    var toFinish;
    var itemIdex = 0;
    waiting.forEach(function(inputItem, i) {
      if (inputItem.name == startKey) {
        if (!toFinish) {
          toFinish = inputItem;
          itemIndex = i;
        }
        if (toFinish && toFinish.date >= inputItem.date) {
          toFinish = inputItem;
          itemIndex = i;
        }
      }
    });

    if (toFinish) {
      endItem.start = toFinish.rawDateTime;
      endItem.end = endItem.rawDateTime;
      var timeDiff = endItem.date - toFinish.date;
      endItem.timeDiff = timeDiff;
      endItem.totalTime = formatTimeDiff(timeDiff);
      if (stat.hasOwnProperty(endItem.name)) {
        stat[endItem.name] += timeDiff;
      } else {
        stat[endItem.name] = timeDiff;
      }
      output.push(endItem);

      waiting.splice(itemIndex, 1);
    }

    return toFinish;
  }

  function formatTimeDiff(timeDiff) {
    var msec = timeDiff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (ss < 10) {
      ss = "0" + ss;
    }
    return hh + ":" + mm + ":" + ss;
  }

  function processOutput(output) {
    var csv = "data:text/csv;charset=utf-8,";
    output.forEach(function(data) {
      csv +=
        data.name +
        ", " +
        data.start +
        ", " +
        data.end +
        ", " +
        data.totalTime +
        "\r\n";
    });

    var encodedUri = encodeURI(csv);

    return csv;
  }

  function processStat(stat) {
    var csv = "data:text/csv;charset=utf-8,";
    for (var key in stat) {
      csv += key + ", " + formatTimeDiff(stat[key]) + "\r\n";
    }

    return csv;
  }

  return processData(data);
}

function getDate(date, time) {
  time = time.split(":");
  date = date.split("/");
  return new Date(
    20 + date[2],
    date[1] - 1,
    date[0],
    time[0],
    time[1],
    time[2]
  );
}

function getClient(output, record) {
  var clients = [
    "uzivatel 1a",
    "uzivatel 1b",
    "uzivatel 2",
    "uzivatel 3",
    "uzivatel 4",
    "uzivatel 5",
    "uzivatel 6a",
    "uzivatel 6b",
    "uzivatel 7",
    "uzivatel 8",
    "uzivatel 9",
    "uzivatel 10",
    "uzivatel 11",
    "uzivatel 12a",
    "uzivatel 12b",
    "uzivatel 14a",
    "uzivatel 14b",
    "uzivatel 15a",
    "uzivatel 15b"
  ];
  output = output.map(line => {
    return {
      reader: line.reader,
      code: line.code,
      date: getDate(line.date, line.time)
    };
  });
  var client = output.find(line => {
    return (
      line.date - record.date <= 30000 &&
      clients.includes(line.code) &&
      line.reader == record.reader
    );
  });
  return client && client.code ? client.code : "Klient nedefinovan";
}

module.exports = router;

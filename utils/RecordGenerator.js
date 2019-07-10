import { Record } from "../model/Record";

export const clientCodes = [
  "uzivatel 1a",
  "uzivatel 1b",
  "Uzivatel 2",
  "uzivatel 3",
  "uzivatel 4",
  "uzivatel 5 ",
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

export default class RecordGenerator {
  constructor() {
    this.START = [
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

    this.END = [
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

    this.clientCodes = clientCodes;

    this.waiting = [];

    this.output = [];

    this.stat = {};
  }

  processData(inputData) {
    this.input = this.assignClient(inputData);

    for (var i = 0; this.input.length > i; i++) {
      var data = this.input[i];

      var name = data.code;
      var client = data.client;

      var rawDateTime = data.date + " " + data.time;
      var reader = data.reader;

      var date = this.getDate(data.date, data.time);

      var inputObj = {
        name: name,
        date: date,
        rawDateTime: rawDateTime,
        reader: reader,
        code: name,
        client: client
      };

      inputObj.inputIndex = i;

      if (this.isNewStarted(name)) {
        this.waiting.push(inputObj);
      } else {
        this.processFinished(inputObj);
      }
    }

    return this.output;
  }

  assignClient(input) {
    input = input.map((item, i) => {
      if (
        !this.clientCodes.includes(item.code) &&
        item.reader == input[i - 1].reader
      ) {
        let clientCode = input[i - 1].code || "Neznamy";
        return {
          ...item,
          client: clientCode
        };
      }
    });

    input = input.filter(item => item);

    return input;
  }

  isNewStarted(name) {
    return this.START.includes(name);
  }

  processFinished(endItem) {
    var index = this.END.indexOf(endItem.name);
    var startKey = this.START[index];
    this.finishWaiting(startKey, endItem);
  }

  finishWaiting(startKey, endItem) {
    var toFinish;
    var itemIndex = 0;
    /* Get client to the endItem */

    this.waiting.forEach((inputItem, i) => {
      if (inputItem.name == startKey) {
        if (!toFinish && inputItem.client == endItem.client) {
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
      endItem.totalTime = this.formatTimeDiff(timeDiff);
      if (this.stat.hasOwnProperty(endItem.name)) {
        this.stat[endItem.name] += timeDiff;
      } else {
        this.stat[endItem.name] = timeDiff;
      }

      this.output.push(new Record(endItem));

      this.waiting = this.waiting.splice(itemIndex, 1);
    }

    return toFinish;
  }

  formatTimeDiff(timeDiff) {
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

  getDate(date, time) {
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
  getClient(inputItem) {
    let clientItem = this.input[inputItem.inputIndex - 1];

    return clientItem && this.clientCodes.includes(clientItem.code)
      ? clientItem.code
      : "Klient nedefinovan";
  }
}

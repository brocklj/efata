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
  "uzivatel 15b",
  "uzivatel 20"
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
    this.input = inputData;
    this.sortInputByDate(this.input);

    for (var i = 0; this.input.length > i; i++) {
      var data = this.input[i];

      var name = data.code;
      if(!this.START.includes(name)) {
        continue;
      }

      var client = this.assignClient(inputData, i);

      var time = this.getTime(inputData, i);

    

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

      const record = new Record();
      record.name = name;
      record.timeDiff = time;
      record.date = date;
      record.client = client;
      record.start = date;
      record.end = date;
      record.reader = reader;

      inputObj.inputIndex = i;

      if(client && time) {
        this.waiting.push(record);
      }      
    }

    return this.waiting;
  }

  assignClient(input, index) {
    try{
      var name = input[index - 1].code;
      if(!this.clientCodes.includes(name)){
        throw 'chyba, klient nenalezen'
      }
      return name;
    }catch(err){
      return null;
    }
  }

  getTime(input, index) {
    var timeSum = 0;
      for (index; input.length > index + 1; index++){
          var item = input[index + 1];
          if(!item.code.startsWith('cas')) {
              break;
          }

          var time = item.code.replace('cas:', '').replace('min', '');
          time = parseInt(time);

          timeSum += time;

      }

      return timeSum * 60000;
  }

  sortInputByDate(input) {
    this.input = input.sort((a, b) => {
      var date1 = this.getDate(a.date, a.time);
      var date2 = this.getDate(b.date, b.time);
      if (date1 == date2) {
        return 0;
      } else if (date2 < date1) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  isNewStarted(name) {
    return this.START.includes(name);
  }

  isFinish(name) {
    return this.END.includes(name);
  }

  processFinished(endItem) {
    var index = this.END.indexOf(endItem.name);
    var startKey = this.START[index];
    this.finishWaiting(startKey, endItem);
  }

  finishWaiting(startKey, endItem) {
    const startItem = this.findStartedForEndItem(startKey, endItem);
    //console.log("startItem", startItem);
    //console.log("endItem", endItem);
    if (!startItem) return;

    const record = new Record();
    record.name = endItem.code;
    record.timeDiff = endItem.date - startItem.date;
    record.date = endItem.date;
    record.client = endItem.client;
    record.start = startItem.date;
    record.end = endItem.date;
    record.reader = endItem.reader;

    this.output.push(record);
  }

  findStartedForEndItem(startKey, endItem) {
    let candidate = null;
    this.waiting = this.waiting.sort((a, b) => {
      if (a.date > b.date) {
        return 0;
      } else if (a.date < b.date) {
        return -1;
      } else {
        return 1;
      }
    });
    let spliceIndex = 0;
    for (let i = 0; this.waiting.length > i; ++i) {
      const item = this.waiting[i];
      if (
        item.code == startKey &&
        endItem.client == item.client &&
        endItem.reader == item.reader
      )
        candidate = item;
      spliceIndex = i;
    }

    let out;
    if (candidate) {
      out = Object.assign({}, candidate);
      this.waiting.splice(spliceIndex, 1, {});
    }

    return out;
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
      time[2],
      0
    );
  }
  getClient(inputItem) {
    let clientItem = this.input[inputItem.inputIndex - 1];

    return clientItem && this.clientCodes.includes(clientItem.code)
      ? clientItem.code
      : null;
  }
}

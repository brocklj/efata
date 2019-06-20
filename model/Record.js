/*export */ class Record {
  constructor(id, name, date, timeDiff, reader, client) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.timeDiff = timeDiff;
    this.reader = reader;
    this.client = client;
  }
}

module.exports = {
  Record: Record
};

/*export */ class Record {
  constructor(id, name, start, end, timeDiff, reader, client) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = end;
    this.timeDiff = timeDiff;
    this.reader = reader;
    this.client = client;
  }
}

module.exports = {
  Record: Record
};

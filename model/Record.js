export class Record {
  constructor(params) {
    const { id, name, date, timeDiff, reader, client, start, end } =
      params || {};
    this.id = id;
    this.name = name;
    this.date = date;
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

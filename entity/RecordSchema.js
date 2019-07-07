const EntitySchema = require("typeorm").EntitySchema;
const Record = require("../model/Record").Record;

module.exports = new EntitySchema({
  uniques: ["UQ_NAMES", "date", "client", "name"],
  name: "Record",
  target: Record,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar"
    },
    date: {
      type: "timestamp"
    },
    timeDiff: {
      type: "bigint"
    },
    reader: {
      type: "varchar"
    },
    client: {
      type: "varchar"
    },
    myyy: {
      type: "varchar",
      nullable: true
    }
  }
});

const EntitySchema = require("typeorm").EntitySchema;
const Record = require("../model/Record").Record;

module.exports = new EntitySchema({
  name: "Post",
  target: Post,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    title: {
      type: "varchar"
    },
    text: {
      type: "text"
    }
  }
});

import RecordGenerator from "../utils/RecordGenerator";
import { Record } from "../model/Record";
describe("Test RecordGenerator", () => {
  test("creates Record one object from single action", () => {
    const sigleActionInputdata = [
      {
        code: "uzivatel 1a",
        time: "13:48:44",
        date: "24/06/19",
        reader: "149436"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:49:00",
        date: "24/06/19",
        reader: "149436"
      },
      {
        code: "cas:30min",
        time: "14:48:44",
        date: "24/06/19",
        reader: "149436"
      },
      {
        code: "cas:5min",
        time: "14:49:00",
        date: "24/06/19",
        reader: "149436"
      },      
    ];

    const example = [
      new Record({
        name: "1A Ubytovani 1",
        date: new Date("2019-06-24T11:49:00.000Z"),
        start:new Date("2019-06-24T11:49:00.000Z"),
        end: new Date("2019-06-24T11:49:00.000Z"),
        reader: "149436",
        timeDiff: 126000,
        client: "uzivatel 1a"
      })
    ];

    const rg = new RecordGenerator();
    const output = rg.processData(sigleActionInputdata);
    expect(output).toEqual(example);
  });

  test("Test RecordGenreatorOn two clients records", () => {
    const multipleInputdata = [
      {
        code: "uzivatel 1a",
        time: "13:48:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:49:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "cas:5min",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "cas:90min",
        time: "13:51:00",
        date: "24/06/19",
        reader: "149439"
      },

      {
        code: "Uzivatel 2",
        time: "13:54:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:55:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "cas:90min",
        time: "13:56:00",
        date: "24/06/19",
        reader: "149439"
      },
    ];

    const example = [
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:53:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T11:49:00.000Z"),
        end: new Date("2019-06-24T11:53:00.000Z"),
        timeDiff: 240000,
        client: "uzivatel 1a"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:55:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T11:51:00.000Z"),
        end: new Date("2019-06-24T11:55:00.000Z"),
        timeDiff: 240000,
        client: "Uzivatel 2"
      })
    ];

    const rg = new RecordGenerator();
    const output = rg.processData(multipleInputdata);
    expect(output).toEqual(example);
  });
});

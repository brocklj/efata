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
        code: "uzivatel 1a",
        time: "14:48:44",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "14:49:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 1a",
        time: "14:50:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "14:51:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 1a",
        time: "14:52:00",
        date: "24/06/19",
        reader: "149436"
      },
      {
        code: "1A Ubyt kon 1",
        time: "14:53:00",
        date: "24/06/19",
        reader: "149436"
      }
    ];

    const example = [
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T12:51:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T12:49:00.000Z"),
        end: new Date("2019-06-24T12:51:00.000Z"),
        timeDiff: 120000,
        client: "uzivatel 1a"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T12:53:00.000Z"),
        reader: "149436",
        start: new Date("2019-06-24T11:49:00.000Z"),
        end: new Date("2019-06-24T12:53:00.000Z"),
        timeDiff: 3840000,
        client: "uzivatel 1a"
      })
    ];

    const rg = new RecordGenerator();
    const output = rg.processData(sigleActionInputdata);
    console.log(output);
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
        code: "Uzivatel 2",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:51:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 1a",
        time: "13:52:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:53:00",
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
        code: "1A Ubyt kon 1",
        time: "13:55:00",
        date: "24/06/19",
        reader: "149439"
      }
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

  test("Test RecordGenreatorOn three clients records", () => {
    const multipleInputdata = [
      {
        code: "uzivatel 1a",
        time: "13:48:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "Jednani se zajemcem 0",
        time: "13:49:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 3",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:51:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "Uzivatel 2",
        time: "13:52:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:53:00",
        date: "24/06/19",
        reader: "149439"
      },

      {
        code: "Uzivatel 2",
        time: "13:56:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:57:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 3",
        time: "13:58:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:59:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 1a",
        time: "14:00:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "Jednani se zaj kon 0",
        time: "14:01:00",
        date: "24/06/19",
        reader: "149439"
      }
    ];

    const example = [
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:57:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T11:53:00.000Z"),
        end: new Date("2019-06-24T11:57:00.000Z"),
        timeDiff: 240000,
        client: "Uzivatel 2"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:59:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T11:51:00.000Z"),
        end: new Date("2019-06-24T11:59:00.000Z"),
        client: "uzivatel 3",
        timeDiff: 480000
      }),
      new Record({
        name: "Jednani se zaj kon 0",
        date: new Date("2019-06-24T12:01:00.000Z"),
        reader: "149439",
        start: new Date("2019-06-24T11:49:00.000Z"),
        end: new Date("2019-06-24T12:01:00.000Z"),
        timeDiff: 720000,
        client: "uzivatel 1a"
      })
    ];

    const rg = new RecordGenerator();
    const output = rg.processData(multipleInputdata);
    expect(output).toEqual(example);
  });
});

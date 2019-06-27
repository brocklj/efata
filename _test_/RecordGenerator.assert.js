import RecordGenerator from "../utils/RecordGenerator";
import { Record } from "../model/Record";
describe("Test RecordGenerator", () => {
  test("creates Record one object from single action", () => {
    const sigleActionInputdata = [
      {
        code: "uzivatel 1a",
        time: "13:48:44",
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
        code: "uzivatel 1a",
        time: "13:49:55",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      }
    ];

    const example = [
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:50:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:49:00",
        end: "24/06/19 13:50:00",
        timeDiff: 60000,
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
        time: "13:48:44",
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
        code: "uzivatel 2",
        time: "13:50:44",
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
        time: "13:49:55",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      },

      {
        code: "uzivatel 2",
        time: "13:55:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:56:00",
        date: "24/06/19",
        reader: "149439"
      }
    ];

    const example = [
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:50:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:49:00",
        end: "24/06/19 13:50:00",
        timeDiff: 60000,
        client: "uzivatel 1a"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:56:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:51:00",
        end: "24/06/19 13:56:00",
        timeDiff: 300000,
        client: "uzivatel 2"
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
        time: "13:48:44",
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
        time: "13:49:44",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:49:55",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 2",
        time: "13:51:44",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubytovani 1",
        time: "13:52:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 1a",
        time: "13:49:55",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "Jednani se zaj kon 0",
        time: "13:50:00",
        date: "24/06/19",
        reader: "149439"
      },

      {
        code: "uzivatel 2",
        time: "13:55:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:56:00",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "uzivatel 3",
        time: "13:59:55",
        date: "24/06/19",
        reader: "149439"
      },
      {
        code: "1A Ubyt kon 1",
        time: "13:59:00",
        date: "24/06/19",
        reader: "149439"
      }
    ];

    const example = [
      new Record({
        name: "Jednani se zaj kon 0",
        date: new Date("2019-06-24T11:50:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:49:00",
        end: "24/06/19 13:50:00",
        timeDiff: 60000,
        client: "uzivatel 1a"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:56:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:52:00",
        end: "24/06/19 13:56:00",
        timeDiff: 240000,
        client: "uzivatel 2"
      }),
      new Record({
        name: "1A Ubyt kon 1",
        date: new Date("2019-06-24T11:59:00.000Z"),
        reader: "149439",
        start: "24/06/19 13:49:55",
        end: "24/06/19 13:59:00",
        client: "uzivatel 3",
        timeDiff: 545000
      })
    ];

    const rg = new RecordGenerator();
    const output = rg.processData(multipleInputdata);
    expect(output).toEqual(example);
  });
});

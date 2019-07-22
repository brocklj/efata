import express from "express";
import { getManager } from "typeorm";
import { processStat } from "../utils/stat";
import { formatTimeDiff, formatDatetime } from "../utils/timeFormat";

const router = express.Router();

router.get("/", async (req, res) => {
  const { id, code, start_date, end_date, client } = req.query;

  console.log(code, start_date, end_date, client);

  const manager = getManager();
  const records = await manager.query(
    `SELECT id, name, client, reader, start, "end", "timeDiff" FROM public.record 
    ${start_date || end_date ? `WHERE` : ``} ${
      start_date
        ? `record."date" >= TO_TIMESTAMP('${start_date}', 'YYYY-MM-DD HH24:MI:SS')`
        : ``
    } ${start_date && end_date ? `AND` : ``} ${
      end_date
        ? `record."date" <= TO_TIMESTAMP('${end_date}', 'YYYY-MM-DD HH24:MI:SS')`
        : ``
    } 
    ${client ? `AND record."client" = '${client}'` : ``}
    ${code ? `AND record."name" = '${code}'` : ``}
    ORDER BY "timeDiff" DESC;`
  );
  const out = processStat(records);

  return res.render("detail", { out });
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await getManager()
    .getRepository("record")
    .delete({ id });
  return res.sendStatus(200);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const record = await getManager()
    .getRepository("record")
    .findOneOrFail(id);
  record.start = formatDatetime(record.start);
  record.end = formatDatetime(record.end);
  record.timeDiff = formatTimeDiff(record.timeDiff);
  return res.status(200).json(record);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.body;

  console.log(id, end);

  const record = await getManager()
    .getRepository("record")
    .findOneOrFail(id);
  return res.status(200).json(record);
});

module.exports = router;

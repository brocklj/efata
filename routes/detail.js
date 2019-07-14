import express from "express";
import { getManager } from "typeorm";
import { processStat } from "../utils/stat";

const router = express.Router();

router.get("/", async (req, res) => {
  const { code, start_date, end_date, client } = req.query;

  console.log(code, start_date, end_date, client);

  const manager = getManager();
  const records = await manager.query(
    `SELECT name, reader, start, "end", "timeDiff" FROM public.record 
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

module.exports = router;

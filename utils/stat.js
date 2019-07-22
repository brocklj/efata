import { formatDate } from "../utils/timeFormat";
import { formatTimeDiff } from "../utils/timeFormat";
import { formatDatetime } from "../utils/timeFormat";

export function processStat(records) {
  let timeSum = 0;
  let countSum = 0;
  records = records.map(r => {
    timeSum += parseInt(r.timeDiff);
    countSum += parseInt(r.count);
    return {
      id: r.id,
      client: r.client,
      name: r.name,
      reader: r.reader,
      totalTime: formatTimeDiff(r.timeDiff),
      count: r.count,
      start: formatDatetime(r.start),
      end: formatDatetime(r.end)
    };
  });
  return { records, timeSum: formatTimeDiff(timeSum), countSum };
}

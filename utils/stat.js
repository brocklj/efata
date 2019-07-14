import { formatDate } from "../utils/timeFormat";
import { formatTimeDiff } from "../utils/timeFormat";
import { formatDatetime } from "../utils/timeFormat";

export function processStat(records) {
  return records.map(r => {
    return {
      name: r.name,
      totalTime: formatTimeDiff(r.timeDiff),
      reader: r.reader,
      count: r.count,
      start: formatDatetime(r.start),
      end: formatDatetime(r.end)
    };
  });
}

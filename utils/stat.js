import { formatDate } from "../utils/timeFormat";
import { formatTimeDiff } from "../utils/timeFormat";
import { formatDatetime } from "../utils/timeFormat";

export function processStat(records) {
  return records.map(r => {
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
}

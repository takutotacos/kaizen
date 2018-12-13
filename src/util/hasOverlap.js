export default function hasOverlap(events, start, end, ignoreIndex) {
  for (let i = 0; i < events.length; i++) {
    if (i === ignoreIndex) {
      continue;
    }

    const selection = events[i];
    if (selection.start > start && selection.start < end) {
      return selection.start;
    }

    if (selection.end > start && selection.end < end) {
      return selection.end;
    }

    if (selection.start <= start && selection.end >= end) {
      return selection.start;
    }
  }
  return undefined;
}

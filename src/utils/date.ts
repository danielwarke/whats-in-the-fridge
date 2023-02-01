import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const daysBeforeExpirationWarning = 3;
dayjs.extend(relativeTime);

export function getDayDiff(dateA: Date, dateB: Date) {
  const timeDiff = dateA.getTime() - dateB.getTime();
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

export function getExpirationStatusColor(expirationDate: Date) {
  const currentDate = new Date();
  const dayDiff = getDayDiff(expirationDate, currentDate) + 1;
  if (currentDate > expirationDate && dayDiff !== 0) {
    return "danger";
  }
  if (dayDiff <= daysBeforeExpirationWarning) {
    return "warning";
  }
}

export function getExpirationText(expirationDate: Date) {
  const currentDate = new Date();
  const dayDiff = getDayDiff(currentDate, expirationDate);
  switch (dayDiff) {
    case 0:
      return "expires today";
    case 1:
      return "expired yesterday";
    case -1:
      return "expires tomorrow";
    default:
      const expiration = dayjs(expirationDate);
      if (currentDate > expirationDate) {
        return `expired ${expiration.fromNow()}`;
      } else {
        return `expires ${expiration.fromNow()}`;
      }
  }
}

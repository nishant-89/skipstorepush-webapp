export const formatChartDay = (date: string) => {
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  if (!month || !day) {
    return "";
  }
  return `${month}/${day}`;
};

export const chartTickStep = (total: number) => {
  if (total <= 8) return 1;
  if (total <= 14) return 2;
  if (total <= 21) return 4;
  if (total <= 35) return 5;
  if (total <= 62) return 8;
  return 12;
};

export const chartTickLabel = (date: string, index: number, total: number) => {
  if (index < 0 || index >= total) {
    return "";
  }
  const step = chartTickStep(total);
  const last = total - 1;
  const nearLast = index !== last && last - index < step;
  if (index % step !== 0 && index !== last) {
    return "";
  }
  if (nearLast) {
    return "";
  }
  return formatChartDay(date);
};

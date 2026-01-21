export const convertMillisecondsToTime = (milliseconds: number): string => {
  if (milliseconds === Infinity) return "";
  if (milliseconds < 0) return "DNF";

  const totalSeconds = milliseconds / 100;

  if (totalSeconds < 60) {
    return totalSeconds.toFixed(2);
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2);
  return Number(seconds) < 10
    ? `${minutes}.0${seconds}`
    : `${minutes}.${seconds}`;
};

export const convertMbldToMinutes = (number: number): string => {
  if (number === Infinity) return "";

  const numStr = `0${number.toString()}`;
  const DD = parseInt(numStr.substring(1, 3), 10);
  const TTTTT = parseInt(numStr.substring(3, 8), 10);
  const MM = parseInt(numStr.substring(8, 10), 10);

  const difference = 99 - DD;
  const solved = difference + MM;
  const attempted = solved + MM;

  const minutes = Math.floor(TTTTT / 60);
  const seconds = TTTTT % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}.${String(seconds).padStart(2, "0")}`;

  return `${solved}/${attempted} ${timeFormatted}`;
};

export const formatResult = (
  result: any,
  eventId: string,
  round: string,
): string => {
  if (!result) return "";

  if (eventId === "333fm" && round === "single") {
    return result.best.toString();
  }

  if (eventId === "333mbf") {
    return convertMbldToMinutes(result.best || Infinity);
  }

  return convertMillisecondsToTime(result.best || Infinity);
};

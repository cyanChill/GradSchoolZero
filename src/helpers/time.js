const convert23Time = (time) => {
  let [hour, second] = time.split(":");
  const AMOrPM = parseInt(hour) >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${second}${AMOrPM}`;
};

const isAfter = (start, end) => {
  let [startHour, startMinute] = start.split(":");
  let [endHour, endMinute] = end.split(":");
  startHour = parseInt(startHour);
  startMinute = parseInt(startMinute);
  endHour = parseInt(endHour);
  endMinute = parseInt(endMinute);

  if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
    return false;
  }

  return true;
};

/* Function to check time conflicts */

export { convert23Time, isAfter };

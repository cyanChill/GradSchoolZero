import _ from "lodash";

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
const checkConflicts = (timeArr) => {
  if (timeArr.length <= 1) return false;

  return timeArr.every((curr, idx1, arr) => {
    return arr.every((other, idx2) => {
      if (idx1 === idx2 || curr.day !== other.day) return true;

      if (
        (isAfter(curr.start, other.start) && isAfter(other.end, curr.start)) ||
        (isAfter(curr.end, other.start) && isAfter(other.end, curr.end))
      ) {
        return false;
      }
      return true;
    });
  });
};

const removeDupe = (arr) => {
  return arr.filter((obj, idx, arr) => {
    const newarr = arr.slice(0, idx);
    if (newarr.length === 0) return true;
    return newarr.every((obj2) => {
      return !_.isEqual(obj, obj2);
    });
  });
};

export { convert23Time, isAfter, checkConflicts, removeDupe };

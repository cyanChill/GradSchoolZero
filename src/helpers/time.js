import _ from "lodash";

// Convert time in the form of 00:00 - 23:59 into 12-hour format
const convert23Time = (time) => {
  let [hour, second] = time.split(":");
  const AMOrPM = parseInt(hour) >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${second}${AMOrPM}`;
};

// Check to see if a time is not after another time (in 00:00-23:59 format)
const isBefore = (t1, t2) => {
  let [t1Hour, t1Minute] = t1.split(":");
  let [t2Hour, t2Minute] = t2.split(":");
  t1Hour = parseInt(t1Hour);
  t1Minute = parseInt(t1Minute);
  t2Hour = parseInt(t2Hour);
  t2Minute = parseInt(t2Minute);

  if (t1Hour > t2Hour || (t1Hour === t2Hour && t1Minute >= t2Minute)) {
    return false;
  }

  return true;
};

// Function to check time conflicts [returning false means no conflicts]
const checkConflicts = (timeArr) => {
  if (timeArr.length <= 1) return false;

  let conflicts = false;

  timeArr.forEach((t1, idx1) => {
    timeArr.forEach((t2, idx2) => {
      if (idx1 === idx2 || t1.day !== t2.day) return;

      if (
        !(
          (isBefore(t1.start, t2.start) && isBefore(t1.end, t2.start)) ||
          (isBefore(t2.start, t1.start) && isBefore(t2.end, t1.start))
        )
      ) {
        conflicts = true;
      }
    });
  });

  return conflicts;
};

// Function to remove duplicate entries
const removeDupe = (arr) => {
  return arr.filter((obj, idx, arr) => {
    const newarr = arr.slice(0, idx);
    if (newarr.length === 0) return true;
    return newarr.every((obj2) => {
      return !_.isEqual(obj, obj2);
    });
  });
};

export { convert23Time, isBefore, checkConflicts, removeDupe };

const gradeEquiv = {
  "A+": 4,
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  "D+": 1.3,
  D: 1,
  F: 0,
};

// Function to calculate the GPA from an input array of letter grades
const calculateGPA = (gradesArr) => {
  const validGrades = gradesArr.filter(
    (letter) => gradeEquiv[letter] !== undefined
  );

  const total = validGrades.reduce(
    (total, curr) => (total += gradeEquiv[curr]),
    0
  );

  return validGrades.length === 0
    ? "The student haven't taken any courses yet"
    : (total / validGrades.length).toFixed(2);
};

export { calculateGPA };

const calcAvgRating = (reviewArr) => {
  if (reviewArr.length === 0) return null

  const sumRating = reviewArr.reduce(
    (total, review) => total + review.rating,
    0
  );
  return sumRating / reviewArr.length;
};

export { calcAvgRating };

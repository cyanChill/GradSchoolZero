const calcAvgRating = (reviewArr) => {
  const sumRating = reviewArr.reduce(
    (total, review) => total + review.rating,
    0
  );
  return sumRating / reviewArr.length;
};

export { calcAvgRating };

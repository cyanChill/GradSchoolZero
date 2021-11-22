import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "../GlobalContext";
import useInfractions from "./useInfractions";

const useReviewFetch = () => {
  const { tabooHook } = useContext(GlobalContext);
  const { countTabooWords, censorTabooWords } = tabooHook;
  const { addWarning } = useInfractions();

  const addReview = async (
    courseInfo,
    instructorInfo,
    reviewerInfo,
    rating,
    reason
  ) => {
    const numTaboo = countTabooWords(reason);
    const filteredReason = censorTabooWords(reason);

    if (numTaboo > 0) {
      const warnReason = `You have been warned for having ${numTaboo} words in your review of [${courseInfo.code}] ${courseInfo.name}.`;
      const warnValue = numTaboo < 3 ? 1 : 2;

      await addWarning(reviewerInfo, warnReason, warnValue);
    }

    const review = {
      id: uuidv4(),
      course: courseInfo,
      instructor: instructorInfo,
      reviewer: reviewerInfo,
      rating: +rating,
      reason: filteredReason,
      show: numTaboo < 3,
      date: new Date(),
    };

    const postResponse = await fetch("http://localhost:2543/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    if (postResponse.ok)
      return {
        status: "success",
        message: "Successfully posted review",
        review,
      };

    return { status: "error", message: "Database failed to add review" };
  };

  return { addReview };
};

export default useReviewFetch;

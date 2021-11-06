import { useState, useEffect } from "react";

const useTabooFetch = () => {
  const [tabooList, setTabooList] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const addTabooWord = (word) => {
    /* 
      Update local taboo list, update taboo list in server (add entry)
    */
  };

  const deleteTabooWord = (word) => {
    /* 
      Update local taboo list (use filter to remove), update taboo list in server (find & delete entry)
    */
  };

  useEffect(() => {
    /* Fetch taboo words from server */
  }, []);

  return { tabooList, loading, addTabooWord, deleteTabooWord };
};

export default useTabooFetch;

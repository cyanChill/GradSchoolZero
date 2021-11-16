import { useState, useEffect } from "react";

const useTabooFetch = () => {
  const [tabooList, setTabooList] = useState([]);

  /* Function to count number of taboo words in the inputted text */

  /* Function to censor all taboo words in the inputted text */

  const addTabooWord = async (word) => {
    const formattedWord = word.toLowerCase();
    const newTabooList = tabooList.includes(formattedWord)
      ? tabooList
      : [...tabooList, formattedWord];

    await fetch(`http://localhost:2543/tabooWords/taboolist`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tabooList: newTabooList,
      }),
    });

    setTabooList(newTabooList);
  };

  const deleteTabooWord = async (word) => {
    const formattedWord = word.toLowerCase();
    const newTabooList = tabooList.filter(
      (tabooword) => tabooword !== formattedWord
    );

    console.log(newTabooList);

    await fetch(`http://localhost:2543/tabooWords/taboolist`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tabooList: newTabooList,
      }),
    });

    setTabooList(newTabooList);
  };

  const refreshTabooList = async () => {
    const res = await fetch(`http://localhost:2543/tabooWords`);
    const data = await res.json();

    if (data.length > 0) {
      setTabooList(data[0].tabooList);
    }
  };

  useEffect(() => {
    refreshTabooList();
  }, []);

  return { tabooList, addTabooWord, deleteTabooWord };
};

export default useTabooFetch;

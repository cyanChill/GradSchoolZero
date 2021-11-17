import { useState, useEffect } from "react";

const useTabooFetch = () => {
  const [tabooList, setTabooList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Function to count number of taboo words in the inputted text */
  const countTabooWords = (str) => {
    let cnt = 0;

    tabooList.forEach((word) => {
      const regex = new RegExp(word, "ig");
      cnt += (str.match(regex) || []).length;
    });

    return cnt;
  };

  /* Function to censor all taboo words in the inputted text */
  const censorTabooWords = (str) => {
    let censorStr = str;

    tabooList.forEach((word) => {
      const regex = new RegExp(word, "ig");
      censorStr = censorStr.replace(regex, "*".repeat(word.length));
    });

    return censorStr;
  };

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
    setLoading(true);
    const res = await fetch(`http://localhost:2543/tabooWords`);
    const data = await res.json();

    if (data.length > 0) {
      setTabooList(data[0].tabooList);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshTabooList();
  }, []);

  return {
    tabooList,
    loading,
    addTabooWord,
    deleteTabooWord,
    countTabooWords,
    censorTabooWords,
  };
};

export default useTabooFetch;

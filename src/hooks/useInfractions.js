import { useState, useEffect } from "react";

const useInfractions = () => {
  const addWarning = async (warningInfo) => {
    await fetch("http://localhost:2543/warnings", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(warningInfo),
    });

    // Increase warning count on user
    const userInfoRes = await fetch(
      `http://localhost:2543/users/${warningInfo.userId}`
    );
    const userData = await userInfoRes.json();
    const warningCnt = +userData.warningCnt || 0;

    await fetch(`http://localhost:2543/users/${warningInfo.userId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        warningCnt: warningCnt + warningInfo.value,
      }),
    });
  };

  const remove1WarningCnt = async (userId) => {
    const userInfoRes = await fetch(`http://localhost:2543/users/${userId}`);
    const userData = await userInfoRes.json();
    let warningCnt = +userData.warningCnt || 0;
    if (warningCnt > 0) warningCnt--;

    await fetch(`http://localhost:2543/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        warningCnt: warningCnt,
      }),
    });
  };

  const getUserWarnings = async (id) => {
    const res = await fetch(`http://localhost:2543/warnings?userId=${id}`);
    const data = await res.json();
    return data;
  };

  const getNewSuspendedUsers = async () => {
    const res = await fetch("http://localhost:2543/users?warningCnt_gte=3");
    const data = await res.json();
    return data;
  };

  return {
    addWarning,
    remove1WarningCnt,
    getUserWarnings,
    getNewSuspendedUsers,
  };
};

export default useInfractions;

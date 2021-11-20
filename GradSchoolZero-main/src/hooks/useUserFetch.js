const useUserFetch = () => {
  /* 
    Also have functions to get other info on the user such as: 
    - classes currently taking
    - grades/previous courses (can calculate gpa with this)
    - reviews given

    (instructors)
    - courses currently teaching
    - courses previously taught
    - rating
  */

  const checkEmailIsUsed = async (email) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length > 0) return true;
    return false;
  };

  const createUser = async (userInfo) => {
    const res = await fetch("http://localhost:2543/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    return res.status === 201;
  };

  const login = async (email, password) => {
    const formattedEmail = email.toLowerCase();

    const response = await fetch(
      `http://localhost:2543/users?email=${formattedEmail}`
    );
    const data = await response.json();

    if (data.length === 0) return { success: false };

    if (data[0].password === password) {
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("userId", data[0].id);
      return { success: true, userId: data[0].id };
    }
    return { success: false };
  };

  const logout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    return true;
  };

  const fetchUserInfo = async (userId) => {
    const response = await fetch(`http://localhost:2543/users/${userId}`);
    const data = await response.json();

    const userInfo = { ...data };
    delete userInfo.password;

    return userInfo;
  };

  return {
    login,
    logout,
    fetchUserInfo,
    checkEmailIsUsed,
    createUser,
  };
};

export default useUserFetch;

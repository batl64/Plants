let initialState = {
  userId: null,
  email: "",
  login: "",
  isAuth: false,
};

const authReduser = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        ...action.data,
        isAuth: true,
      };
    case "Log_Out":
      return {
        ...state,
        ...action.data,
        isAuth: false,
      };
    default:
      return state;
  }
};

export const setUserData = (userId, email, login) => ({
  type: "SET_USER_DATA",
  data: { userId, email, login },
});
export const Loguot = () => ({
  type: "Log_Out",
  data: { userId: "", email: "", login: "" },
});
export default authReduser;

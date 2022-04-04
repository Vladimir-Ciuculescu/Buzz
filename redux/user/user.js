const SET_USER_EMAIL = "SET_USER_EMAIL";
const SET_USER_NAME = "SET_USER_NAME";
const SET_USER_AVATAR = "SET_USER_AVATAR";

export const setUserEmail = (email) => ({
  type: SET_USER_EMAIL,
  payload: email,
});

export const setUserName = (name) => ({
  type: SET_USER_NAME,
  payload: name,
});

export const setUserAvatar = (avatar) => ({
  type: SET_USER_AVATAR,
  payload: avatar,
});

const INITIAL_STATE = {
  name: "",
  email: "",
  avatar: "",
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_EMAIL:
      return { ...state, email: action.payload };
    case SET_USER_NAME:
      return { ...state, name: action.payload };
    case SET_USER_AVATAR:
      return { ...state, avatar: action.payload };
    default:
      return state;
  }
};

export default userReducer;

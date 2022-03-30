const CHANGE_THEME = "CHANGE_THEME";

export const changeTheme = (mode) => ({
  type: CHANGE_THEME,
  payload: mode,
});

const INITIAL_STATE = {
  mode: "light",
};

const themeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

export default themeReducer;

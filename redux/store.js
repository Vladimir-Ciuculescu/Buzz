import themeReducer from "./theme/theme";
import userReducer from "./user/user";
import { createStore, combineReducers } from "redux";
import { AsyncStorage } from "react-native";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["mode"],
};

const rootReducer = combineReducers({
  theme: persistReducer(persistConfig, themeReducer),
  user: persistReducer(persistConfig, userReducer),
});

export const store = createStore(rootReducer);

export const persistor = persistStore(store);

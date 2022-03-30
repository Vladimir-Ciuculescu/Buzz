import themeReducer from "./theme/theme";
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
});

// export const configureStore = () => {
//   return createStore(rootReducer);
// };

export const store = createStore(rootReducer);

export const persistor = persistStore(store);

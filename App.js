import React from "react";
import { Text } from "react-native";
import { LogBox } from "react-native";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import firebase from "firebase";

LogBox.ignoreAllLogs(true);

const firebaseConfig = {
  apiKey: "AIzaSyBiGTaFqnFoT2aj5KkvgoAr422VsVgMKtA",
  authDomain: "wadwad-60664.firebaseapp.com",
  projectId: "wadwad-60664",
  storageBucket: "wadwad-60664.appspot.com",
  messagingSenderId: "1005852185814",
  appId: "1:1005852185814:web:1cc3df7a46a96c7e5de577",
  measurementId: "G-CLNTYEKDL3",
};

//If no firebase app has been initialized when the component is rendered, initialize it
// Else use the one initialized already

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

//screens
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

const AppStack = createStackNavigator({
  Home: HomeScreen,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Loading",
    }
  )
);

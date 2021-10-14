import React from "react";
import { Text } from "react-native";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import firebase from "firebase";

//screens
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

var firebaseConfig = {
  apiKey: "AIzaSyDGSqKcZcb6dPTEYPvhbbBZhB9DBTZwe6Y",
  authDomain: "licenta-ec832.firebaseapp.com",
  projectId: "licenta-ec832",
  storageBucket: "licenta-ec832.appspot.com",
  messagingSenderId: "752828941053",
  appId: "1:752828941053:web:615a29ebce3c967d40b494",
  measurementId: "G-8DLE0JFN63",
};

//If no firebase app has been initialized when the component is rendered, initialize it
// Else use the one initialized already

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

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

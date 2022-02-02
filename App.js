import React from "react";
import { Text, View, LogBox, StatusBar, Platform } from "react-native";
import { NativeBaseProvider, themeTools, extendTheme } from "native-base";
import {
  AntDesign,
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import firebase from "firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AsyncStorage } from "react-native";

//screens
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import MessageScreen from "./screens/MessageScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostScreen from "./screens/PostScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ModalScreen from "./screens/ModalScreen";
import PublicChatScreen from "./screens/PublicChatScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StreamChatScreen from "./screens/StreamChatScreen";
import API_KEY from "./StreamCredentials";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-expo";
import Searcher from "./screens/Searcher";
import TestModal from "./screens/TestModal";
import PersonSearcher from "./screens/PersonSearcher";

//Ignore warnings
LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["Setting a timer"]);

//Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyBiGTaFqnFoT2aj5KkvgoAr422VsVgMKtA",
  authDomain: "wadwad-60664.firebaseapp.com",
  projectId: "wadwad-60664",
  storageBucket: "wadwad-60664.appspot.com",
  messagingSenderId: "1005852185814",
  appId: "1:1005852185814:web:1cc3df7a46a96c7e5de577",
  measurementId: "G-CLNTYEKDL3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const client = StreamChat.getInstance(API_KEY);

const Tabs = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "grey",
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "ios-home" : "ios-home-outline"}
              size={24}
              color={focused ? "blue" : "grey"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={
                focused ? "message-processing" : "message-processing-outline"
              }
              size={24}
              color={focused ? "blue" : "grey"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({}) => (
            <AntDesign
              name="pluscircle"
              size={35}
              color="blue"
              style={{
                shadowColor: "#E9446A",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 10,
                shadowOpacity: 0.3,
              }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Modal", { screen: "ModalScreen" });
          },
        })}
      />

      <Tabs.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Fontisto
              name={focused ? "bell-alt" : "bell"}
              size={24}
              color={focused ? "blue" : "grey"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? "blue" : "grey"}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

function MyStacks() {
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: (props) => {
          return {
            color: themeTools.mode("red.300", "blue.300")(props),
          };
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          options={{ headerLeft: null }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="App"
          component={MyTabs}
        />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="AddChat" component={AddChatScreen} />
        <Stack.Group>
          <Stack.Screen name="Modal" component={PostScreen} />
        </Stack.Group>
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="PublicChat" component={PublicChatScreen} />
        <Stack.Screen name="StreamChat" component={StreamChatScreen} />
        <Stack.Screen name="TestModal" component={TestModal} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Searcher"
          component={Searcher}
        />
        <Stack.Screen
          name="PersonSearcher"
          component={PersonSearcher}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={SettingsScreen}
      screenOptions={{ headerShown: false, swipeEdgeWidth: 0 }}
    >
      <Drawer.Screen name="MyStacks" component={MyStacks} />
    </Drawer.Navigator>
  );
};

const Application = () => {
  return (
    <NavigationContainer>
      <Chat client={client}>
        <StatusBar
          style={{ height: 50 }}
          translucent
          barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        ></StatusBar>
        <DrawerNavigator></DrawerNavigator>
      </Chat>
    </NavigationContainer>
  );
};

export default Application;

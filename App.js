import React from "react";
import { Text, View } from "react-native";
import { LogBox } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { StatusBar } from "expo-status-bar";

import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import firebase from "firebase";
import { createBottomTabNavigator as BottomNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator as StackNavigator } from "@react-navigation/stack";
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
import { TouchableOpacity } from "react-native-gesture-handler";
import PublicChatScreen from "./screens/PublicChatScreen";
import ProfileScreen2 from "./screens/ProfileScreen2";
import ChatScreen from "./screens/ChatScreen";

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

const Tabs = BottomNavigator();

function MyTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        activeTintColor: "#008ae6",
        inactiveTintColor: "#161F3D",
        showLabel: false,
        headerTitleAlign: "center",
        style: { borderTopColor: "#A9A9A9", borderTopWidth: 1, height: 60 },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ tintColor }) => (
            <Entypo name="home" size={24} color={tintColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="message-processing"
              size={24}
              color={tintColor}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({ tintColor }) => (
            <AntDesign
              name="pluscircle"
              size={35}
              color="#65a84d"
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
          tabBarIcon: ({ tintColor }) => (
            <Octicons name="bell" size={24} color={tintColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ tintColor }) => (
            <Ionicons name="person" size={24} color={tintColor} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Entypo name="home" size={24} color={tintColor} />
            ),
          },
        },
        Message: {
          screen: MessageScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="message-processing"
                size={24}
                color={tintColor}
              />
            ),
          },
        },

        Post: {
          screen: PostScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <AntDesign
                name="pluscircle"
                size={48}
                color="#65a84d"
                style={{
                  shadowColor: "#E9446A",
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3,
                }}
              />
            ),
          },
        },

        Notification: {
          screen: NotificationScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Octicons name="bell" size={24} color={tintColor} />
            ),
          },
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="person" size={24} color={tintColor} />
            ),
          },
        },
      },
      {
        defaultNavigationOptions: {
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            if (navigation.state.key === "Post") {
              navigation.navigate("postModal");
            } else {
              defaultHandler();
            }
          },
        },
        tabBarOptions: {
          activeTintColor: "#008ae6",
          inactiveTintColor: "#161F3D",
          showLabel: false,
          style: { borderTopColor: "#A9A9A9", borderTopWidth: 1, height: 60 },
        },
      }
    ),
    postModal: {
      screen: PostScreen,
    },
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

const Stack = StackNavigator();

function MyStacks() {
  return (
    <NavigationContainer>
      <StatusBar></StatusBar>
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
        <Stack.Group
          screenOptions={{
            presentation: "modal",
            headerRight: () => <Text>Post</Text>,
            headerBackTitle: "Back",
            headerTitleAlign: "center",
            headerTitle: "Make a new post",
            headerLeftLabelVisible: false,
          }}
        >
          <Stack.Screen name="Modal" component={PostScreen} />
        </Stack.Group>
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="PublicChat" component={PublicChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStacks;

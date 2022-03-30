import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import firebase from "firebase";
import { Center, VStack, Skeleton, HStack } from "native-base";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Text, View, Button, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../redux/theme/theme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(mode);
  const { mode } = useSelector((state) => state.theme);
  const [text, seText] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: mode === "light" ? "red" : "black",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={() => {
          if (theme === "dark") {
            setTheme("light");
            dispatch(changeTheme("light"));
          } else {
            setTheme("dark");
            dispatch(changeTheme("dark"));
          }
        }}
        // async () => {
        // await sendPushNotification(expoPushToken);}
      />
    </View>
    // <Center w="100%">
    //   <VStack
    //     w="100%"
    //     maxW="400"
    //     borderWidth="1"
    //     space={6}
    //     rounded="md"
    //     alignItems="center"
    //     _dark={{
    //       borderColor: "coolGray.500",
    //     }}
    //     _light={{
    //       borderColor: "coolGray.200",
    //     }}
    //   >
    //     <Skeleton h="250" />
    //     <Skeleton
    //       borderWidth={1}
    //       borderColor="coolGray.200"
    //       endColor="warmGray.50"
    //       size="150"
    //       rounded="2xl"
    //       mt="-70"
    //     />
    //     <HStack space="2">
    //       <Skeleton size="5" rounded="full" />
    //       <Skeleton size="5" rounded="full" />
    //       <Skeleton size="5" rounded="full" />
    //       <Skeleton size="5" rounded="full" />
    //       <Skeleton size="5" rounded="full" />
    //     </HStack>
    //     <Skeleton.Text lines={3} alignItems="center" px="12" />
    //     <Skeleton mb="3" w="40" rounded="20" />
    //   </VStack>
    // </Center>
  );
};

export default NotificationScreen;

async function sendPushNotification(expoPushToken) {
  const message = {
    to: "ExponentPushToken[h4IfQMDgpN1ikaHm5IE9My]",
    sound: "default",
    title: "Original Title",
    body: "du-te dracu!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import NotificationCard from "../components/NotificationCard";

import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

const NotificationScreen = ({ navigation, color, anticolor }) => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(mode);
  const { mode } = useSelector((state) => state.theme);
  const [notifications, setNotifications] = useState([]);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const getNotifications = async () => {
    setNotifications([]);
    const notifications = await firebase
      .firestore()
      .collection("notifications")
      .orderBy("timestamp", "asc")
      .get();

    notifications.forEach((doc) => {
      if (doc.data().notificationPollType) {
        setNotifications((oldArray) => [
          ...oldArray,
          {
            avatar: doc.data().avatar,
            owner: doc.data().owner,
            notificationType: doc.data().notificationType,
            timestamp: doc.data().timestamp,
            notificationId: doc.data().notificationId,
            notificationPollType: doc.data().notificationPollType,
            pollText: doc.data().pollText,
          },
        ]);
      } else {
        setNotifications((oldArray) => [
          ...oldArray,
          {
            avatar: doc.data().avatar,
            owner: doc.data().owner,
            notificationType: doc.data().notificationType,
            timestamp: doc.data().timestamp,
            notificationId: doc.data().notificationId,
            pollText: doc.data().pollText,
          },
        ]);
      }
    });
  };

  const refreshScreen = () => {
    setLoadingRefresh(true);

    getNotifications();

    setLoadingRefresh(false);
  };

  useEffect(() => {
    setNotifications([]);
    getNotifications();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color === "#101010" ? "#000000" : "white" },
      ]}
    >
      {notifications.length ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={notifications}
          renderItem={(item) => (
            <NotificationCard
              color={color}
              anticolor={anticolor}
              navigation={navigation}
              avatar={item.item.avatar}
              owner={item.item.owner}
              notificationType={item.item.notificationType}
              timestamp={item.item.timestamp}
              notificationId={item.item.notificationId}
              notificationPollType={item.item.notificationPollType}
              pollText={item.item.pollText}
            />
          )}
          refreshing={loadingRefresh}
          onRefresh={() => refreshScreen()}
        />
      ) : (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={color === "#101010" ? "white" : "black"}
          size="large"
        ></ActivityIndicator>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import React, { useState, useEffect, useRef } from "react";
// import { Text, View, Platform } from "react-native";
// import { Button } from "native-base";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) =>
//       setExpoPushToken(token)
//     );

//     // This listener is fired whenever a notification is received while the app is foregrounded
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         setNotification(notification);
//       });

//     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log(response);
//       });

//     return () => {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "space-around",
//       }}
//     >
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: "center", justifyContent: "center" }}>
//         <Text>
//           Title: {notification && notification.request.content.title}{" "}
//         </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>
//           Data:{" "}
//           {notification && JSON.stringify(notification.request.content.data)}
//         </Text>
//       </View>
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );
// }

// // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: "default",
//     title: "Original Title",
//     body: "And here is the body!",
//     data: { someData: "goes here" },
//   };

//   await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",

//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }

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

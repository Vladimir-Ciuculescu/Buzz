import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import NotificationCard from "../components/NotificationCard";

import { Text, View, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const NotificationScreen = ({ navigation }) => {
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
      .get();

    notifications.forEach((doc) => {
      setNotifications((oldArray) => [
        ...oldArray,
        {
          avatar: doc.data().avatar,
          owner: doc.data().owner,
          notificationType: doc.data().notificationType,
          timestamp: doc.data().timestamp,
          notificationId: doc.data().notificationId,
        },
      ]);
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
    <FlatList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={notifications}
      renderItem={(item) => (
        <NotificationCard
          navigation={navigation}
          avatar={item.item.avatar}
          owner={item.item.owner}
          notificationType={item.item.notificationType}
          timestamp={item.item.timestamp}
          notificationId={item.item.notificationId}
        />
      )}
      refreshing={loadingRefresh}
      onRefresh={() => refreshScreen()}
    />
  );
};

export default NotificationScreen;

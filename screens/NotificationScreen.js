import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Text } from "react-native";

const NotificationScreen = () => {
  const [text, seText] = useState("");

  useEffect(() => {
    const subscribe = async () => {
      firebase
        .firestore()
        .collection("test")
        .doc("testDoc")
        .onSnapshot(() => {
          console.log();
        });
    };

    subscribe();
  }, [text]);

  return <Text>{text}</Text>;
};

export default NotificationScreen;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";

const ChatElement = ({ id, chatName, avatar, enterChat }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getLatestMessage = firebase
      .firestore()
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

    return getLatestMessage;
  });

  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri: avatar
            ? avatar
            : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {messages?.[messages.length - 1]?.name}:{" "}
          {messages?.[messages.length - 1]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatElement;

const styles = StyleSheet.create({});

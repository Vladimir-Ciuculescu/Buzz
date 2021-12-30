import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";

const ChatElement = ({ id, chatName, avatar, enterChat }) => {
  return (
    <ListItem
      onPress={() => enterChat(id, chatName, avatar)}
      key={id}
      bottomDivider
    >
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
          nothing for now
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatElement;

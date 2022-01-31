import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const ChatElement = ({
  id,
  chatName,
  avatar,
  enterChat,
  userId,
  loggedInUserId,
}) => {
  return (
    <ListItem onPress={() => ({})} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri: avatar
            ? avatar
            : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{ fontWeight: "700", fontSize: 14, marginBottom: 15 }}
        >
          {chatName}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatElement;

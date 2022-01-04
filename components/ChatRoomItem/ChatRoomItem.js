import React from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import styles from "./styles";

const ChatRoomItem = ({ chatRoom }) => {
  const user = chatRoom.users[1];
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: user.imageUri,
        }}
        style={styles.image}
      ></Image>
      {chatRoom.messagesNumber ? (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{chatRoom.messagesNumber}</Text>
        </View>
      ) : null}
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {chatRoom.lastMessage.content}
        </Text>
      </View>
    </View>
  );
};

export default ChatRoomItem;

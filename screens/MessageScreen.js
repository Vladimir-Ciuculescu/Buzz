import React from "react";
import { Text, Image, View, StyleSheet, FlatList } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem/ChatRoomItem";
import ChatRoom from "../assets/dummyData/ChatRoom";

const chatRoom1 = ChatRoom[0];
const chatRoom2 = ChatRoom[1];

const MessageScreen = () => {
  return (
    <View style={styles.page}>
      <FlatList
        data={ChatRoom}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
      />
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});

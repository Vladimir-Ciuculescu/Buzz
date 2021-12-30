import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import firebase from "firebase";
import firetore from "firebase/firestore";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    await firebase
      .firestore()
      .collection("chats")
      .doc(input)
      .set({
        chatName: input,
      })
      .then(() => navigation.goBack());
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat screen"
        value={input}
        onChangeText={(text) => setInput(text)}
      ></Input>
      <Button onPress={createChat} title="Create a new chat" />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({});

import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { useRoute } from "@react-navigation/core";
import { TouchableOpacity } from "react-native-gesture-handler";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setlLoading] = useState(false);

  const route = useRoute();
  const client = route.params.client;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    setlLoading(true);

    const channel = client.channel("messaging", input, {
      name: input,
    });
    await channel.watch();

    navigation.goBack();

    setlLoading(false);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter the chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
      ></Input>
      <TouchableOpacity
        onPress={createChat}
        disabled={input === "" ? true : false}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="large"></ActivityIndicator>
        ) : (
          <Text>awdaw</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({});

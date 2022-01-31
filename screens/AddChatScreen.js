import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Input } from "react-native-elements";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { useRoute } from "@react-navigation/core";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setlLoading] = useState(false);
  const [chatName, setChatName] = useState("");

  const route = useRoute();
  const client = route.params.client;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  useEffect(() => {
    var result = input.replace(/\s+/g, " ").trim();
    result = result.toLowerCase();
    result = result.replaceAll(" ", "-");
    setChatName(result);
  }, [input]);

  const setChannelName = (text) => {
    setInput(text);
  };

  const createChat = async () => {
    setlLoading(true);

    const channel = client.channel("messaging", chatName, {
      name: chatName,
    });
    await channel.watch();

    navigation.goBack();

    setlLoading(false);
  };

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        placeholder="Enter the chat name"
        value={input}
        onChangeText={(text) => setChannelName(text)}
      ></Input>
      <View style={{ flexDirection: "row" }}>
        <Feather name="hash" size={24} color="black" />
        <Text style={{ fontSize: 22 }}>{chatName}</Text>
      </View>
      <TouchableOpacity
        onPress={createChat}
        disabled={input === "" ? true : false}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="large"></ActivityIndicator>
        ) : (
          <Text>Add a new chat</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({});

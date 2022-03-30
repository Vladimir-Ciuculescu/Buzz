import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useChatContext } from "stream-chat-expo";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setlLoading] = useState(false);
  const [chatName, setChatName] = useState("");

  const { client } = useChatContext();

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

    const usersResponse = await client.queryUsers({});

    let Users = [];

    usersResponse.users.map((user) => {
      Users.push(user.id);
    });

    const channel = client.channel("messaging", chatName, {
      name: chatName,
    });
    await channel.watch();

    await channel.addMembers(Users);

    navigation.goBack();

    setlLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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

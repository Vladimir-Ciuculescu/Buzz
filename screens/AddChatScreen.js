import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { Input } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useChatContext } from "stream-chat-expo";
import { useSelector } from "react-redux";

const AddChatScreen = ({ navigation }) => {
  const { mode } = useSelector((state) => state.theme);
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
    <View
      style={{
        backgroundColor: mode === "light" ? "transparent" : "#101010",
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Feather
          style={{ marginTop: 10, marginLeft: 10 }}
          name="hash"
          size={24}
          color={mode === "dark" ? "white" : "black"}
        />
        <Input
          autoCapitalize="none"
          placeholder="Enter the chat name"
          value={input}
          onChangeText={(text) => setChannelName(text)}
          style={{
            color: mode === "dark" ? "white" : "black",
            maxWidth: "85%",
          }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        ></Input>
      </View>
      <Button
        onPress={createChat}
        disabled={input === "" ? true : false}
        style={styles.addChat}
        mode="contained"
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="large"></ActivityIndicator>
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "white",
            }}
          >
            Add a new chat
          </Text>
        )}
      </Button>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  addChat: {
    marginHorizontal: 30,
    marginTop: 20,
    backgroundColor: "#1a75ff",
  },
});

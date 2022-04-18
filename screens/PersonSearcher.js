import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { Divider, Avatar } from "react-native-elements";
import { useLayoutEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import { useChatContext } from "stream-chat-expo";
import { useSelector } from "react-redux";

const PersonSearcher = ({ navigation, color, anticolor }) => {
  const { mode } = useSelector((state) => state.theme);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");

  const { client } = useChatContext();

  useEffect(() => {
    const fetchPersons = async () => {
      const response = await client.queryUsers({ id: { $ne: client.userID } });

      const id = await AsyncStorage.getItem("userId");
      setUserId(id);

      const results = response.users.filter(
        (item) => item.id !== "vladimir-ciuculescu"
      );

      const filteredResults = results;
      setUsers(
        filteredResults.map((item) => ({
          name: item.name,
          image: item.image,
          id: item.id.toLowerCase().replace("-", " "),
        }))
      );
    };

    fetchPersons();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "What's on your mind ?",
      headerTintColor: anticolor,
      presentation: "modal",
      headerStyle: { backgroundColor: color },
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <AntDesign
            name="close"
            size={24}
            color={mode === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const searchPerson = (e) => {
    const result = e.toLowerCase();
    setInput(result);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const filteredUsers = users.filter((item) => item.id.includes(input));
    setFilteredUsers(filteredUsers);
  }, [input]);

  const enterConversation = async (id) => {
    const name = id.replace(" ", "-");
    const space = name.indexOf("-");
    const Name =
      name.charAt(0).toUpperCase() +
      name.slice(1, space + 1) +
      name.charAt(space + 1).toUpperCase() +
      name.slice(space + 2);

    const { users } = await client.queryUsers({
      id: { $eq: Name },
    });
    const { token } = users[0];

    if (userId < token) {
      const response = await client.queryChannels({
        id: { $eq: userId + token },
      });
      if (response.length === 0) {
        const channel = client.channel("messaging", userId + token, {
          name: userId + token,
          members: [users[0].id, client.userID],
        });

        await channel.watch();

        navigation.navigate("StreamChat", {
          channel: response[0],
        });
      } else {
        const members = await response[0].queryMembers({
          user_id: { $ne: client.userID },
        });
        navigation.navigate("StreamChat", {
          channel: response[0],
          name: members.members[0].user_id.replace("-", " "),
        });
      }
    } else {
      const response = await client.queryChannels({
        id: { $eq: token + userId },
      });
      if (response.length === 0) {
        const channel = client.channel("messaging", token + userId, {
          name: token + userId,
          members: [users[0].id, client.userID],
        });

        await channel.watch();

        navigation.navigate("StreamChat", {
          channel: response[0],
        });
      } else {
        const members = await response[0].queryMembers({
          user_id: { $ne: client.userID },
        });
        navigation.navigate("StreamChat", {
          channel: response[0],
          name: members.members[0].user_id.replace("-", " "),
        });
      }
    }
  };

  const renderUser = ({ item }) => {
    const name = item.id.replace("-", " ");
    const space = name.indexOf(" ");
    const Name =
      name.charAt(0).toUpperCase() +
      name.slice(1, space + 1) +
      name.charAt(space + 1).toUpperCase() +
      name.slice(space + 2);

    return (
      <TouchableOpacity
        onPress={() => enterConversation(item.id)}
        style={{ flexDirection: "row", paddingTop: 15 }}
      >
        <Avatar
          title={
            name.charAt(0).toUpperCase() + name.charAt(space + 1).toUpperCase()
          }
          style={styles.avatar}
          rounded
          source={{ uri: item.image }}
          overlayContainerStyle={{ backgroundColor: "red" }}
        />
        <Text
          style={{
            fontSize: 16,
            paddingLeft: 15,
            alignSelf: "center",
            fontWeight: "bold",
            color: mode === "dark" ? "white" : "black",
          }}
        >
          {Name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: mode === "dark" ? "#101010" : "transparent",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: mode === "dark" ? "#101010" : "transparent",
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            marginLeft: 10,
            backgroundColor: mode === "dark" ? "#101010" : "transparent",
            color: mode === "dark" ? "white" : "black",
          }}
        >
          To:{" "}
        </Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Start a new conversation with someone"
          style={[
            styles.searchPersonInput,
            {
              backgroundColor: mode === "dark" ? "#101010" : "transparent",
            },
          ]}
          onChangeText={(e) => searchPerson(e)}
          placeholderTextColor={mode === "dark" ? "white" : "black"}
        />
      </View>
      <Divider width={1} color="grey" />
      <View>
        <FlatList
          style={{ paddingLeft: 30 }}
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default PersonSearcher;

const styles = StyleSheet.create({
  searchPersonInput: {
    height: 40,
    borderWidth: 2,
    width: "94%",
    paddingLeft: 10,
    borderColor: "transparent",
    color: "black",
  },
  results: {
    marginTop: 30,
    width: "95%",
    marginHorizontal: 10,
    marginRight: 30,
    height: "85%",
  },
  avatar: {
    width: 30,
    height: 30,
  },
});

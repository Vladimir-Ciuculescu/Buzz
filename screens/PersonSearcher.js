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
import firebase from "firebase";

const PersonSearcher = ({ navigation }) => {
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

      const results = response.users;
      setUsers(
        results.map((item) => ({
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
      presentation: "modal",
      title: "New message",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 10 }}
        >
          <AntDesign name="close" size={24} color="black" />
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

    console.log(users[0].id);
    console.log(client.userID);

    if (userId < token) {
      // const conversation = client.channel('messaging', {
      //   members:
      // })
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
        <Avatar style={styles.avatar} rounded source={{ uri: item.image }} />
        <Text
          style={{
            fontSize: 16,
            paddingLeft: 15,
            alignSelf: "center",
            fontWeight: "600",
          }}
        >
          {Name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ alignSelf: "center", marginLeft: 10 }}>To: </Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Start a new conversation with someone"
          style={styles.searchPersonInput}
          onChangeText={(e) => searchPerson(e)}
        />
      </View>
      <Divider width={1} color="grey" />
      <View style={styles.results}>
        <FlatList
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

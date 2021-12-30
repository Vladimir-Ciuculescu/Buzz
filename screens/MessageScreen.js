import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import ChatElement from "../components/ChatElement";
import firebase from "firebase";
import firetore from "firebase/firestore";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  AntDesign,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const MessageScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState("");
  const [conversations, setConversations] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    let user;
    const fetchData = async () => {
      user = await AsyncStorage.getItem("user");
      setCurrentUser(user);
      const query = await firebase
        .firestore()
        .collection("accounts")
        .doc(user)
        .get();

      setAvatar(query.data().avatar);
    };
    fetchData();

    const fetchUsers = async () => {
      await firebase
        .firestore()
        .collection("accounts")
        .where("email", "!=", currentUser)
        .get()
        .then((snapshot) => {
          setConversations(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    };

    fetchUsers();

    const fetchConversations = async () => {
      firebase
        .firestore()
        .collection("chats")
        .onSnapshot((snapshot) => {
          setChannels(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    };

    fetchConversations();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerStyle: {
        backgroundColor: "#1E90FF",
        height: Platform.OS === "ios" ? headerHeight : 100,
      },
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar rounded source={{ uri: avatar }} />
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddChat", { screen: "AddChatScreen" })
            }
          >
            <MaterialCommunityIcons
              name="chat-plus-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", { id, chatName });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Direct messages</Text>
        {conversations.map(({ id, data: { firstName, lastName, avatar } }) => (
          <ChatElement
            key={id}
            id={id}
            chatName={firstName + " " + lastName}
            avatar={avatar}
          />
        ))}
        <Text>Channels</Text>
        {channels.map(({ id, data: { chatName } }) => (
          <ChatElement
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
            avatar=""
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;

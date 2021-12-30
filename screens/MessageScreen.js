import React, { useEffect, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

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
import PublicChatElement from "../components/PublicChatElement";
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
    const unsubscribe = navigation.addListener("state", () => {
      const fetchData = async () => {
        const user = await AsyncStorage.getItem("user");
        const avatar = await AsyncStorage.getItem("avatar");
        setCurrentUser(user);
        setAvatar(avatar);
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
    });

    return unsubscribe;
  }, [navigation, avatar]);

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
  }, [navigation, avatar]);

  const enterPublicChat = (id, chatName) => {
    navigation.navigate("PublicChat", { id, chatName });
  };

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
            enterChat={enterChat}
          />
        ))}
        <Text>Channels</Text>
        {channels.map(({ id, data: { chatName } }) => (
          <PublicChatElement
            key={id}
            id={id}
            chatName={chatName}
            enterPublicChat={enterPublicChat}
            avatar=""
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;

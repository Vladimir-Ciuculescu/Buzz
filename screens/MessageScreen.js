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
  Animated,
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
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { Accordion } from "native-base";

const MessageScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState("");
  const [conversations, setConversations] = useState([]);
  const [channels, setChannels] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [UserId, setUserId] = useState("");

  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchData = async () => {
        const user = await AsyncStorage.getItem("user");
        const UserId = await AsyncStorage.getItem("userId");
        setUserId(UserId);
        const avatar = await AsyncStorage.getItem("avatar");
        const firstName = await AsyncStorage.getItem("firstName");
        const lastName = await AsyncStorage.getItem("lastName");
        setCurrentUserName(firstName + " " + lastName);
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
  }, [navigation, avatar, conversations]);

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
  }, [navigation, avatar, conversations]);

  const enterPublicChat = (id, chatName) => {
    navigation.navigate("PublicChat", { id, chatName });
  };

  const enterChat = async (id, chatName, avatar, toUserId, loggedInUserId) => {
    navigation.navigate("Chat", {
      id,
      chatName,
      avatar,
      toUserId,
      loggedInUserId,
    });

    const chatDoc = await firebase
      .firestore()
      .collection("private-chats")
      .doc(loggedInUserId + toUserId)
      .get();
    const chatDoc2 = await firebase
      .firestore()
      .collection("private-chats")
      .doc(toUserId + loggedInUserId)
      .get();

    if (!chatDoc.exists && !chatDoc2.exists) {
      await firebase
        .firestore()
        .collection("private-chats")
        .doc(loggedInUserId + toUserId)
        .set({
          chat: "chat",
        });
    }
  };

  const rightActions = (dragX, index) => {
    return (
      <TouchableOpacity>
        <Animated.View style={styles.deleteButton}>
          <AntDesign name="delete" size={24} color="black" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction}>
        <Animated.View
          style={[
            styles.deleteButton,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <AntDesign name="delete" size={24} color="black" />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Accordion allowMultiple>
          <Accordion.Item>
            <Accordion.Summary>
              Direct Messages
              <Accordion.Icon />
            </Accordion.Summary>
            {conversations.map(
              ({ id, data: { firstName, lastName, avatar, userId } }) => (
                <Accordion.Details>
                  <Swipeable
                    renderLeftActions={renderLeftActions}
                    renderRightActions={rightActions}
                  >
                    <ChatElement
                      key={id}
                      id={id}
                      chatName={firstName + " " + lastName}
                      userId={userId}
                      loggedInUserId={UserId}
                      avatar={avatar}
                      enterChat={enterChat}
                    />
                  </Swipeable>
                </Accordion.Details>
              )
            )}
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Summary>
              Conversations
              <Accordion.Icon />
            </Accordion.Summary>
            {channels.map(({ id, data: { chatName } }) => (
              <Accordion.Details>
                <Swipeable
                  renderLeftActions={renderLeftActions}
                  renderRightActions={rightActions}
                >
                  <PublicChatElement
                    key={id}
                    id={id}
                    chatName={chatName}
                    enterPublicChat={enterPublicChat}
                    avatar=""
                  />
                </Swipeable>
              </Accordion.Details>
            ))}
          </Accordion.Item>
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  deleteButton: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});

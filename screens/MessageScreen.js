import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Avatar } from "react-native-elements";
import ChatElement from "../components/ChatElement";
import firebase from "firebase";
import firetore from "firebase/firestore";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import { Accordion } from "native-base";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { FAB } from "react-native-paper";
import { OverlayProvider, useChatContext, ChannelList } from "stream-chat-expo";
import ChannelElement from "../components/ChannelElement";

const client = StreamChat.getInstance(API_KEY);

const MessageScreen = ({ navigation }) => {
  const { client } = useChatContext();
  const [avatar, setAvatar] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [UserId, setUserId] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isReady, SetIsReady] = useState(false);
  const [channels, setChannels] = useState([]);

  useLayoutEffect(() => {
    const result = navigation.addListener("focus", () => {
      const fetchUser = async () => {
        const user = await AsyncStorage.getItem("user");
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);

        const response = await client.queryChannels();
        setChannels(response);

        await firebase
          .firestore()
          .collection("accounts")
          .where("email", "!=", user)
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

      fetchUser();
    });

    return result;
  }, [navigation]);

  const onChannelPressed = (channel) => {
    setSelectedChannel(channel);
    navigation.navigate("StreamChat", {
      channel: channel,
      name: channel.data.name,
    });
  };

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
    });

    return unsubscribe;
  }, [navigation, avatar]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerStyle: {
        backgroundColor: "#1E90FF",
      },
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar rounded source={{ uri: avatar }} />
        </View>
      ),
    });
  }, [navigation, avatar, conversations]);

  const OpenSearcher = () => {
    navigation.navigate("Searcher");
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

  if (isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <TextInput
            onFocus={OpenSearcher}
            placeholder="Looking for someone ?"
            style={styles.searchPersonInput}
          />
          {/* <ChannelList onSelect={(e) => onChannelPressed(e)}></ChannelList> */}
          <Accordion allowMultiple>
            <Accordion.Item>
              <Accordion.Summary>
                Direct Messages
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity>
                    <AntDesign
                      name="plus"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                  <Accordion.Icon />
                </View>
              </Accordion.Summary>
              {conversations.map(
                ({ id, data: { firstName, lastName, avatar, userId } }) => (
                  <Accordion.Details marginX={-5} marginY={-3}>
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
                      />
                    </Swipeable>
                  </Accordion.Details>
                )
              )}
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Summary>
                Channels
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity>
                    <AntDesign
                      name="plus"
                      size={24}
                      color="black"
                      style={{ marginRight: 10 }}
                    />
                  </TouchableOpacity>
                  <Accordion.Icon />
                </View>
              </Accordion.Summary>
              {channels.map(({ id }) => (
                <Accordion.Details marginX={-5} marginY={-3}>
                  <Swipeable
                    renderLeftActions={renderLeftActions}
                    renderRightActions={rightActions}
                  >
                    <ChannelElement
                      key={id}
                      id={id}
                      channelName={id}
                      navigation={navigation}
                    />
                  </Swipeable>
                </Accordion.Details>
              ))}
            </Accordion.Item>
          </Accordion>
          <FAB
            style={styles.fab}
            small
            icon="chat-plus"
            onPress={() => navigation.navigate("AddChat", { client: client })}
          />
        </OverlayProvider>
      </SafeAreaProvider>
    );
  }
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
  searchPersonInput: {
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 10,
    backgroundColor: "#DCDCDC",
    borderColor: "transparent",
    color: "black",
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
  },
});

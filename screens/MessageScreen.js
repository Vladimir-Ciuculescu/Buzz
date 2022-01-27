import React, { useEffect, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
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
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  Chat,
  OverlayProvider,
  ChannelList,
  ChannelPreviewUnreadCount,
} from "stream-chat-expo";

const client = StreamChat.getInstance(API_KEY);

const MessageScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [UserId, setUserId] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isReady, SetIsReady] = useState(false);

  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const result = navigation.addListener("focus", () => {
      const fetchUser = async () => {
        const user = await AsyncStorage.getItem("user");
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);

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
  }, []);

  const onChannelPressed = (channel) => {
    setSelectedChannel(channel);
    navigation.navigate("StreamChat", {
      channel: channel,
      client: client,
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
            onPress={() => navigation.navigate("AddChat", { client: client })}
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

  const CustomPreviewTitle = ({ channel }) => (
    <Text>
      {channel.data.cutomProperty} - {channel.data.name}
    </Text>
  );

  const CustomPreviewUnreadCount = ({ channel }) => {
    console.log("CANAAAAAL", channel.state.read);
    return <Text>awdawd</Text>;
  };
  if (isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            <ChannelList
              PreviewUnreadCount={CustomPreviewUnreadCount}
              onSelect={(e) => onChannelPressed(e)}
            ></ChannelList>
          </Chat>
          <View style={{ height: 200 }}>
            <Text>awdawd</Text>
          </View>
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
});

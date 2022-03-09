import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { FAB } from "react-native-paper";
import { OverlayProvider, useChatContext, ChannelList } from "stream-chat-expo";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(API_KEY);

const MessageScreen = ({ navigation }) => {
  const { client } = useChatContext();
  const [avatar, setAvatar] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [UserId, setUserId] = useState("");
  const [isReady, SetIsReady] = useState(false);

  const [oneWeek, setOneWeek] = useState(new Date());

  useLayoutEffect(() => {
    const result = navigation.addListener("focus", () => {
      const fetchUser = async () => {
        const user = await AsyncStorage.getItem("user");
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);

        const OneWeek = new Date();
        OneWeek.setDate(OneWeek.getDate() - 2);
        setOneWeek(OneWeek);
      };

      fetchUser();
    });

    return result;
  }, []);

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
          <Avatar
            style={styles.avatar}
            title={client.user.id.charAt(0)}
            rounded
            source={{ uri: avatar }}
            overlayContainerStyle={{ backgroundColor: "red" }}
          />
        </View>
      ),
    });
  }, [navigation, avatar]);

  const OpenSearcher = () => {
    navigation.navigate("Searcher");
  };

  const enterChannel = (channel) => {
    let channelName;
    if (Object.keys(channel.state.members)[0] === client.user.id) {
      channelName = Object.keys(channel.state.members)[1];
    } else {
      channelName = Object.keys(channel.state.members)[0];
    }

    navigation.navigate("StreamChat", {
      channel: channel,
      name: channelName.replace("-", " "),
    });
  };

  const enterPublicChannel = (channel) => {
    navigation.navigate("StreamChat", {
      channel: channel,
      name: channel.id,
    });
  };

  const CustomPreviewTitle = ({ channel }) => {
    let channelName;

    if (Object.keys(channel.state.members)[0] === client.user.id) {
      channelName = Object.keys(channel.state.members)[1];
    } else {
      channelName = Object.keys(channel.state.members)[0];
    }

    return <Text>{channelName.replace("-", " ")}</Text>;
  };

  const CustomPreviewAvatar = () => {
    return (
      <Feather
        name="hash"
        style={{ paddingLeft: 5, paddingTop: 5 }}
        size={24}
        color="black"
      />
    );
  };

  return (
    <SafeAreaProvider>
      <OverlayProvider>
        <ScrollView>
          <TextInput
            onFocus={OpenSearcher}
            placeholder="Looking for someone ?"
            style={styles.searchPersonInput}
          />

          <View>
            <View style={styles.messagesHeader}>
              <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                Direct messages
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonSearcher")}
                style={{
                  right: 0,
                  position: "absolute",
                  alignSelf: "center",
                  marginRight: 10,
                }}
              >
                <AntDesign name="plus" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ChannelList
              filters={{
                member_count: { $eq: 2 },
                last_message_at: { $gte: oneWeek },
                members: { $in: [client.user.id] },
              }}
              onSelect={(channel) => enterChannel(channel)}
              PreviewTitle={CustomPreviewTitle}
            />

            <View style={styles.messagesHeader}>
              <Text style={{ alignSelf: "center", marginLeft: 10 }}>
                Channels
              </Text>
              <TouchableOpacity
                style={{
                  right: 0,
                  position: "absolute",
                  alignSelf: "center",
                  marginRight: 10,
                }}
              >
                <AntDesign name="plus" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <ChannelList
              PreviewAvatar={CustomPreviewAvatar}
              filters={{
                member_count: { $ne: 2 },
                last_message_at: { $gte: oneWeek },
              }}
              onSelect={(channel) => enterPublicChannel(channel)}
            />
          </View>
        </ScrollView>
      </OverlayProvider>
      <FAB
        style={styles.fab}
        small
        icon="chat-plus"
        onPress={() => navigation.navigate("AddChat", { client: client })}
      />
    </SafeAreaProvider>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
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
  avatar: {
    width: 35,
    height: 35,
  },
  messagesHeader: {
    width: "100%",
    height: 40,
    backgroundColor: "#6495ED",
    display: "flex",
    flexDirection: "row",
  },
});

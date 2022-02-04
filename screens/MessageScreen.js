import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { Accordion } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { FAB } from "react-native-paper";
import { OverlayProvider, useChatContext } from "stream-chat-expo";
import ChannelElement from "../components/ChannelElement";
import { Image } from "react-native-elements/dist/image/Image";

const MessageScreen = ({ navigation }) => {
  const { client } = useChatContext();
  const [avatar, setAvatar] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [UserId, setUserId] = useState("");
  const [isReady, SetIsReady] = useState(false);
  const [channels, setChannels] = useState([]);
  const [privateChannels, setPrivateChannels] = useState([]);

  useLayoutEffect(() => {
    const result = navigation.addListener("focus", () => {
      const fetchUser = async () => {
        const user = await AsyncStorage.getItem("user");
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);

        const OneWeek = new Date();
        OneWeek.setDate(OneWeek.getDate() - 2);

        const publicChannels = await client.queryChannels({
          member_count: { $ne: 2 },
          last_message_at: { $gte: OneWeek },
        });

        const privateChannels = await client.queryChannels({
          member_count: { $eq: 2 },
          last_message_at: { $gte: OneWeek },
          joined: { $eq: true },
        });

        setChannels(publicChannels);
        setPrivateChannels(privateChannels);
      };

      fetchUser();
    });

    return result;
  }, [navigation]);

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

  if (isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <ScrollView>
            <TextInput
              onFocus={OpenSearcher}
              placeholder="Looking for someone ?"
              style={styles.searchPersonInput}
            />
            {/* <ChannelList
              filters={{
                member_count: { $ne: 2 },
              }}
            /> */}

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
                    <TouchableOpacity
                      onPress={() => navigation.navigate("PersonSearcher")}
                    >
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
                {privateChannels.map(({ id, state }) => {
                  console.log(state.members);
                  let channelName;
                  let image;
                  if (Object.keys(state.members)[0] === client.user.id) {
                    channelName = Object.keys(state.members)[1];
                    Image = state.members[channelName].user.image;
                  } else {
                    channelName = Object.keys(state.members)[0];
                    image = state.members[channelName].user.image;
                  }

                  console.log(image);

                  return (
                    <Accordion.Details marginX={-5} marginY={-3}>
                      <ChannelElement
                        key={id}
                        id={id}
                        channelName={channelName.replace("-", " ")}
                        navigation={navigation}
                        currentUser={client.user.id}
                        image={image}
                      />
                    </Accordion.Details>
                  );
                })}
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
                    <ChannelElement
                      key={id}
                      id={id}
                      channelName={id}
                      navigation={navigation}
                    />
                  </Accordion.Details>
                ))}
              </Accordion.Item>
            </Accordion>
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

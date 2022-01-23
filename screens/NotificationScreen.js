import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StreamChat } from "stream-chat";
import {
  Chat,
  OverlayProvider,
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-expo";

const API_KEY = "uxafdkrq5ftg";
const client = StreamChat.getInstance(API_KEY);

export default function NotificationScreen() {
  const [isReady, SetIsReady] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(
        {
          id: "vadim",
          name: "vadim sadim",
          image: "wadwadwad",
        },
        client.devToken("vadim")
      );

      //create a channel if it does not exist, otherwise enter the current one
      const channel = client.channel("messaging", "dude", {
        name: "hello",
      });
      await channel.create();
      SetIsReady(true);
    };
    connectUser();

    return () => client.disconnectUser();
  }, []);

  const onChannelPressed = (channel) => {
    setSelectedChannel(channel);
  };

  if (!isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
          <Chat client={client}>
            {selectedChannel ? (
              <Channel channel={selectedChannel}>
                <MessageList />
                <MessageInput />
                <Text
                  style={{ margin: 30 }}
                  onPress={() => setSelectedChannel(null)}
                >
                  adawdaw
                </Text>
              </Channel>
            ) : (
              <ChannelList onSelect={onChannelPressed} />
            )}
          </Chat>
        </OverlayProvider>
      </SafeAreaProvider>
    );
  }

  // return (
  //   <View style={styles.container}>
  //     <Button
  //       title="Press to Send Notification"
  //       onPress={() =>
  //         sendPushNotification("ExponentPushToken[KB4w73LiDWi81_LehrBSWe]")
  //       }
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
});

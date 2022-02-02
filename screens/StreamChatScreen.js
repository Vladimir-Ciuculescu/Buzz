import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import {
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
} from "stream-chat-react-native-core";
import { useRoute } from "@react-navigation/core";
import { SafeAreaView } from "react-native";

const StreamChatScreen = ({ navigation }) => {
  const route = useRoute();
  const channel = route.params.channel;
  const name = route.params.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  if (!channel) {
    return <Text>wadawdaw</Text>;
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <OverlayProvider bottomInset={90}>
        <Channel channel={channel}>
          <MessageList />
          <MessageInput />
        </Channel>
      </OverlayProvider>
    </SafeAreaView>
  );
};

export default StreamChatScreen;

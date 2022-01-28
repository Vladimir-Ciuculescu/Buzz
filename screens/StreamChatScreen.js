import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import {
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
  Chat,
} from "stream-chat-react-native-core";
import { useRoute } from "@react-navigation/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import { useEffect } from "react";
import { useChatContext } from "stream-chat-expo";

const StreamChatScreen = ({ navigation }) => {
  const route = useRoute();
  const channel = route.params.channel;
  const name = route.params.name;

  const { client } = useChatContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
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

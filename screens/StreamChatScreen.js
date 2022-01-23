import React from "react";
import { Text } from "react-native";
import {
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
  Chat,
} from "stream-chat-react-native-core";
import { useRoute } from "@react-navigation/core";

const StreamChatScreen = () => {
  const route = useRoute();
  const channel = route.params.channel;

  if (!channel) {
    return <Text>wadawdaw</Text>;
  }

  return (
    <OverlayProvider>
      <Chat client={route.params.client}>
        <Channel channel={channel}>
          <MessageList />
          <MessageInput />
        </Channel>
      </Chat>
    </OverlayProvider>
  );
};

export default StreamChatScreen;

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
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SafeAreaView } from "react-navigation";
import { useEffect } from "react";

const StreamChatScreen = ({ navigation }) => {
  const { bottom } = useSafeAreaInsets();

  const route = useRoute();
  const channel = route.params.channel;
  const name = route.params.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  });

  if (!channel) {
    return <Text>wadawdaw</Text>;
  }

  return (
    <View>
      <OverlayProvider bottomInset={90}>
        <Chat client={route.params.client}>
          <Channel channel={channel}>
            <MessageList />
            <MessageInput />
          </Channel>
        </Chat>
      </OverlayProvider>
    </View>
  );
};

export default StreamChatScreen;

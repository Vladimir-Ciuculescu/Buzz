import React, { useEffect, useLayoutEffect } from "react";
import { ListItem } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { useChatContext } from "stream-chat-expo";
import { Avatar } from "react-native-elements";
import { View } from "react-native";
import { useState } from "react";

const ChannelElement = ({
  id,
  channelName,
  members,
  navigation,
  image,
  lastMessage,
}) => {
  const { client } = useChatContext();

  const [lastMessageText, setLastMessageText] = useState("");

  const enterChannel = async () => {
    const response = await client.queryChannels({ id: { $eq: id } });
    navigation.navigate("StreamChat", {
      channel: response[0],
      name: channelName,
    });
  };

  useLayoutEffect(() => {
    const fetchLastMessage = navigation.addListener("focus", () => {
      if (lastMessage) {
        if (channelName.replace(" ", "-") === lastMessage.user.name) {
          setLastMessageText("" + lastMessage.text);
        } else {
          setLastMessageText("You: " + lastMessage.text);
        }
      }
    });

    return fetchLastMessage;
  }, [navigation]);

  return (
    <ListItem onPress={enterChannel} key={id} bottomDivider>
      <ListItem.Content
        style={{ flexDirection: "row", justifyContent: "flex-start" }}
      >
        {image ? (
          <Avatar
            rounded
            source={{ uri: image }}
            overlayContainerStyle={{ backgroundColor: "red" }}
          />
        ) : (
          <Feather
            style={{ paddingLeft: 20 }}
            name="hash"
            size={24}
            color="black"
          />
        )}

        <View style={{ flexDirection: "column", marginLeft: 10 }}>
          <ListItem.Title
            style={{
              fontWeight: "700",
              fontSize: 14,
              marginTop: 3,
            }}
          >
            {channelName}
          </ListItem.Title>
          <ListItem.Subtitle>{lastMessageText}</ListItem.Subtitle>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChannelElement;

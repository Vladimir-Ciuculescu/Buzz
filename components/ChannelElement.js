import React from "react";
import { ListItem } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { useChatContext } from "stream-chat-expo";

const ChannelElement = ({ id, channelName, members, navigation }) => {
  const { client } = useChatContext();

  const enterChannel = async () => {
    console.log(members);

    const response = await client.queryChannels({ id: { $eq: id } });
    navigation.navigate("StreamChat", {
      channel: response[0],
      name: channelName,
    });
  };

  return (
    <ListItem onPress={enterChannel} key={id} bottomDivider>
      <ListItem.Content
        style={{ flexDirection: "row", justifyContent: "flex-start" }}
      >
        <Feather
          style={{ paddingLeft: 20 }}
          name="hash"
          size={24}
          color="black"
        />
        <ListItem.Title
          style={{
            fontWeight: "700",
            fontSize: 14,
            marginTop: 3,
            marginLeft: 10,
          }}
        >
          {channelName}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChannelElement;

import React from "react";
import { ListItem } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import { useChatContext } from "stream-chat-expo";
import { Avatar } from "react-native-elements";

const ChannelElement = ({ id, channelName, members, navigation, image }) => {
  const { client } = useChatContext();

  const enterChannel = async () => {
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
        {image ? (
          <Avatar
            //style={styles.avatar}
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

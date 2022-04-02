import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { Avatar, Badge } from "react-native-elements";
import moment from "moment";

const LeftContent = ({ avatar }) => (
  <Avatar style={{ height: 45, width: 45 }} rounded source={{ uri: avatar }} />
);

const NotificationCard = ({
  avatar,
  owner,
  notificationType,
  timestamp,
  navigation,
  notificationId,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InfoPost", { postId: notificationId })
      }
    >
      <Card
        style={{
          flexShrink: 1,
        }}
      >
        <Card.Title
          title={
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", fontSize: 15, marginTop: 10 }}>
                {owner}
              </Text>
              <Text style={{ fontSize: 15, marginTop: 10 }}>
                {notificationType === "informational"
                  ? " created a new informational post"
                  : " created a new poll !a"}
              </Text>
            </View>
          }
          subtitle={moment(timestamp).fromNow()}
          left={() => <LeftContent avatar={avatar} />}
        />
      </Card>
    </TouchableOpacity>
  );
};

export default NotificationCard;

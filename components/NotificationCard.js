import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, Card, Title } from "react-native-paper";
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
      onPress={() => {
        if (notificationType === "informational") {
          navigation.navigate("InfoPost", {
            postId: notificationId,
            owner: owner,
          });
        } else {
          navigation.navigate("UpdateSingleSelectPoll", {
            postId: notificationId,
          });
        }
      }}
    >
      <Card
        style={{
          flexShrink: 1,
        }}
      >
        <Card.Title
          title={
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, marginTop: 10 }}
                >
                  {owner}
                </Text>
                <Text style={{ fontSize: 15, marginTop: 10 }}>
                  {notificationType === "informational"
                    ? " created a new informational post"
                    : " created a new poll"}
                </Text>
              </View>
              <Text style={{ marginTop: 5, color: "grey" }}>
                Here is the post content
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

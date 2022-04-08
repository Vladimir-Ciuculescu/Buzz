import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import { Avatar, Badge } from "react-native-elements";
import moment from "moment";
import { color } from "react-native-reanimated";

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
  notificationPollType,
  pollText,
  color,
  anticolor,
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
          if (notificationPollType === "Multiple select") {
            navigation.navigate("UpdateMultipleSelectPoll", {
              postId: notificationId,
            });
          } else if (notificationPollType === "Single select") {
            navigation.navigate("UpdateSingleSelectPoll", {
              postId: notificationId,
            });
          }
        }
      }}
    >
      <Card
        style={{
          flexShrink: 1,
          backgroundColor: color,
          borderRadius: 0,
          borderColor: anticolor,
          borderTopWidth: 0.1,
          borderBottomWidth: 0.1,
        }}
      >
        <Card.Title
          title={
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    marginTop: 10,
                    color: anticolor,
                  }}
                >
                  {owner}
                </Text>
                <Text style={{ fontSize: 15, marginTop: 10, color: anticolor }}>
                  {notificationType === "informational"
                    ? " created a new informational post"
                    : " created a new poll"}
                </Text>
              </View>
              <Text style={{ marginTop: 5, color: "grey" }}>
                {pollText ? pollText : ""}
              </Text>
            </View>
          }
          subtitle={
            <Text style={{ color: anticolor }}>
              {moment(timestamp).fromNow()}
            </Text>
          }
          left={() => <LeftContent avatar={avatar} />}
        />
      </Card>
    </TouchableOpacity>
  );
};

export default NotificationCard;

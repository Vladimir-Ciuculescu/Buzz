import React from "react";
import { Text } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

const NotificationCard = () => {
  return (
    <Card>
      <Card.Title
        title="Someone made a new post !"
        subtitle="18 h"
        left={LeftContent}
      />
    </Card>
  );
};

export default NotificationCard;

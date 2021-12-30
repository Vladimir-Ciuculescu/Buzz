import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";

const ChatScreen = ({ navigation, route, avatar }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="arrowleft"
            size={24}
            color="blue"
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: route.params.avatar,
            }}
          />
          <Text style={{ marginLeft: 10, fontWeight: "800" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View>
      <Text>navigation</Text>
    </View>
  );
};

export default ChatScreen;

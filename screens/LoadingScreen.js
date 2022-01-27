import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AsyncStorage } from "react-native";
import { StreamChat } from "stream-chat";
import API_KEY from "../StreamCredentials";

const client = StreamChat.getInstance(API_KEY);

export default class LoadingScreen extends React.Component {
  async componentDidMount() {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const fullName = await AsyncStorage.getItem("fullName");
      const userId = await AsyncStorage.getItem("userId");
      const avatar = await AsyncStorage.getItem("avatar");
      console.log(fullName);
      console.log(userId);
      console.log(avatar);
      this.fetchUser(userId, fullName, avatar);

      this.props.navigation.navigate("App");
    } else {
      this.props.navigation.navigate("Login");
    }
  }

  fetchUser = async (id, name, image) => {
    await client.connectUser(
      {
        id: name,
        name: name,
        image: image,
        token: id,
      },
      client.devToken(name)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="green"></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

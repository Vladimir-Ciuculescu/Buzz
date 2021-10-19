import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { AsyncStorage } from "react-native";
import Fire from "../Fire";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    const user = AsyncStorage.getItem("user");
    this.props.navigation.navigate(user ? "App" : "Auth");
  }

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

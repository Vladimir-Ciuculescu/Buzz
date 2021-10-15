import React from "react";
import { View, Text, StyleSheet, Button, Touchable } from "react-native";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home screen</Text>
        <TouchableOpacity>
          <Text onPress={() => this.props.navigation.navigate("Login")}>
            Go back
          </Text>
        </TouchableOpacity>
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

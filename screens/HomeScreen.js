import React from "react";
import { View, Text, StyleSheet, Button, Touchable } from "react-native";
import { BottomNavigation } from "react-native-paper";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MusicRoute from "./MusicRoute";
import RecentsRoute from "./RecentsRoute";
import AlbumsRoute from "./AlbumsRoute";
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: "albums", title: "Albums", icon: "album" },
        { key: "recents", title: "Recents", icon: "history" },
      ],
    };
  }

  _handleIndexChange = (index) => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
  });

  render() {
    return (
      <View style={styles.container}>
        <Text>Home screen</Text>
        <BottomNavigation
          navigationState={this.state}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
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

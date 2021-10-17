import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Touchable,
  AsyncStorage,
} from "react-native";
import { BottomNavigation, Snackbar } from "react-native-paper";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import firetore from "firebase/firestore";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getUser();
    this.state = {
      visible: true,
      user: "",
    };
  }

  getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    console.log(user);
    const query = firebase.firestore().collection("accounts").doc(user).get();
    const firstName = (await query).data().firstName;
    const lastName = (await query).data().lastName;
    const fullName = firstName + " " + lastName;
    this.setState({ user: fullName });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Home screen</Text>
        <Snackbar
          visible={this.state.visible}
          action={{
            label: "Close",
            onPress: () => {
              this.setState({ visible: false });
            },
          }}
          onDismiss={() => this.setState({ visible: false })}
        >
          Logged in as {this.state.user}
        </Snackbar>
        <TouchableOpacity>
          <Text onPress={() => this.props.navigation.navigate("Login")}>
            Go back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goBack}>
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
  goBack: {
    position: "absolute",
    marginTop: -100,
  },
});

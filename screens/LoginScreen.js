import React from "react";
import firebase from "firebase";
import firetore from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";

export default class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    navigation: this.props.navigation,
  };

  handleLogin = async () => {
    const { email, password } = this.state;

    var conditional = false;

    const query = await firebase.firestore().collection("accounts").get();

    for (const doc of query.docs) {
      if (email === doc.data().email && password === doc.data().password) {
        conditional = true;
      }
    }

    if (conditional === true) {
      this.props.navigation.navigate("Home");
    } else {
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.greeting}>{`Hi partner \n Welcome back !`}</Text>

        <View style={styles.form}>
          <View>
            <Text>Email address</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.input}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            ></TextInput>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text>Password</Text>
            <TextInput
              underlineColorAndroid="transparent"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            ></TextInput>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.handleLogin()}
          >
            <Text style={{ color: "#FFF" }}>Login</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text>
              New to Buzz ?,{" "}
              <Text style={{ color: "#258e25", fontWeight: "700" }}>
                Sign Up here !
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 32,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  input: {
    borderBottomColor: "#258e25",
    borderBottomWidth: 2,
    height: 50,
    fontSize: 15,
    color: "#258e25",
  },
  loginButton: {
    marginHorizontal: 30,
    backgroundColor: "#258e25",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

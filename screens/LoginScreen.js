import React from "react";
import firebase from "firebase";
import firetore from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  LayoutAnimation,
  Image,
  ScrollView,
} from "react-native";

/*
import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
*/

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: "",
    password: "",
    loginLoading: false,
    inexistentAccountError: "",
  };

  handleLogin = async () => {
    const { email, password } = this.state;

    var existentAccount = false;

    this.setState({ loginLoading: true });

    const query = await firebase.firestore().collection("accounts").get();

    for (const doc of query.docs) {
      if (email === doc.data().email && password === doc.data().password) {
        existentAccount = true;
      }
    }

    this.setState({ loginLoading: false });

    if (existentAccount === true) {
      this.setState({
        inexistentAccountError: "",
      });
      this.props.navigation.navigate("Home");
    } else {
      this.setState({
        inexistentAccountError: "This account does not exist !",
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar barStyle="light-content"></StatusBar>
          <Image
            source={require("../assets/green_circle.png.png")}
            style={styles.greenCircle}
          ></Image>
          <Image
            source={require("../assets/Yellow_icon.svg.png")}
            style={styles.yellowCircle}
          ></Image>

          <Image
            source={require("../assets/vsp2.png")}
            style={styles.logo}
          ></Image>

          <Text
            style={styles.greeting}
          >{`Hello partner, \n Welcome back !`}</Text>

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

          <View style={styles.errorMessage}>
            <Text style={{ color: "#ff0000" }}>
              {this.state.inexistentAccountError}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.handleLogin()}
            >
              {this.state.loginLoading ? (
                <ActivityIndicator
                  color="#FFF"
                  size="large"
                ></ActivityIndicator>
              ) : (
                <Text style={{ color: "#FFF" }}>Login</Text>
              )}
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 360,
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
  errorMessage: {
    alignItems: "center",
    marginTop: -20,
    marginBottom: 20,
  },
  greenCircle: {
    width: 500,
    height: 500,
    position: "absolute",
    zIndex: -3,
    marginLeft: 100,
    marginTop: -350,
  },
  yellowCircle: {
    width: 400,
    height: 400,
    position: "absolute",
    zIndex: -3,
    marginLeft: -180,
    marginTop: -330,
  },
  logo: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 100,
  },
});

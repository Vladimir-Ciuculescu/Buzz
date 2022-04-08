import React from "react";
import firebase from "firebase";
import firetore from "firebase/firestore";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AsyncStorage } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { dispatch, useDispatch } from "react-redux";

import { HelperText, TextInput } from "react-native-paper";

const client = StreamChat.getInstance(API_KEY);

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getData();
    this.state = {
      user: "",
      deviceToken: "",
      email: "",
      password: "",
      loginLoading: false,
      inexistentAccountError: "",
      visiblePassword: true,
      statusColor: "#65a84d",
      emailError: "",
      passwordError: "",
      firstName: "",
      lastName: "",
      userId: "",
    };
  }

  ToRegister = () => {
    this.setState({ email: "" });
    this.setState({ password: "" });
    this.setState({ emailError: "" });
    this.setState({ passwordError: "" });
    this.props.navigation.navigate("Register", { marian: "smth" });
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (value !== null) {
        this.setState({ token: value });
      }
      if (user !== null) {
        this.setState({ user: user });
      }
    } catch (e) {}
  };

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

  handleLogin = async () => {
    const { email, password } = this.state;

    var validateAllFields = true;

    var existentAccount = false;

    //Validate email

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@vspartners\.us$/;

    if (this.state.email === "") {
      validateAllFields = false;
      this.setState({ emailError: "This field cannot be empty " });
    } else if (this.state.email !== "") {
      if (emailRegex.test(this.state.email) === false) {
        this.setState({ emailError: "Invalid vsp address" });
        validateAllFields = false;
      } else {
        this.setState({ emailError: "" });
      }
    }

    //Validate password

    if (this.state.password === "") {
      this.setState({ passwordError: "This field cannot be empty" });
      validateAllFields = false;
    } else {
      this.setState({ passwordError: "" });
    }

    if (validateAllFields) {
      this.setState({ loginLoading: true });
      const query = await firebase.firestore().collection("accounts").get();

      for (const doc of query.docs) {
        if (email === doc.data().email && password === doc.data().password) {
          existentAccount = true;
          userId = doc.data().userId;
          await AsyncStorage.setItem("avatar", doc.data().avatar);
          await AsyncStorage.setItem("firstName", doc.data().firstName);
          await AsyncStorage.setItem("lastName", doc.data().lastName);
          this.setState({
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            userId: doc.data().userId,
            avatar: doc.data().avatar,
          });
        }
      }

      this.setState({ loginLoading: false });

      if (existentAccount === true) {
        this.setState({
          inexistentAccountError: "",
        });
        this.setState({ token: "abc123" });

        //create a new user for getstream, or get the current one

        await AsyncStorage.setItem("userId", this.state.userId);
        await AsyncStorage.setItem("user", this.state.email);
        const fullName = this.state.firstName + "-" + this.state.lastName;

        await AsyncStorage.setItem("fullName", fullName);

        this.fetchUser(this.state.userId, fullName, this.state.avatar);

        this.props.navigation.navigate(
          "App",
          {
            screen: "HomeScreen",
          },
          { firstName: this.state.firstName }
        );

        if (this.state.deviceToken) {
          await firebase
            .firestore()
            .collection("accounts")
            .doc(this.state.email)
            .update({
              deviceToken: this.state.deviceToken,
            });
        }
      } else {
        this.setState({
          inexistentAccountError: "This account does not exist !",
          statusColor: "#ff0000",
        });
      }
    } else {
      return;
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.greenCircle}></View>

            <View style={styles.yellowCircle}></View>

            <Image
              source={require("../assets/vsp2.png")}
              style={styles.logo}
            ></Image>

            <Text style={styles.greeting}>
              {`Hello partner, \n Welcome back !`}
            </Text>

            <View style={styles.form}>
              <View>
                <TextInput
                  theme={{
                    colors: {
                      primary: "#258e25",
                      underlineColor: "transparent",
                    },
                  }}
                  mode="outlined"
                  label="Email address"
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  right={
                    <TextInput.Icon forceTextInputFocus={false} name="email" />
                  }
                />
                <HelperText type="error">{this.state.emailError}</HelperText>
              </View>

              <View>
                <TextInput
                  theme={{
                    colors: {
                      primary: "#258e25",
                      underlineColor: "transparent",
                    },
                  }}
                  mode="outlined"
                  label="Password"
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  secureTextEntry={this.state.visiblePassword}
                  right={
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      name={this.state.visiblePassword ? "eye-off" : "eye"}
                      onPress={() =>
                        this.setState({
                          visiblePassword: !this.state.visiblePassword,
                        })
                      }
                    />
                  }
                />
                <HelperText type="error">{this.state.passwordError}</HelperText>
              </View>
            </View>

            <View style={styles.errorMessage}>
              <HelperText type="error" style={{ fontSize: 20 }}>
                {this.state.inexistentAccountError}
              </HelperText>
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
                style={{
                  alignSelf: "center",
                  marginTop: 32,
                  marginBottom: 20,
                }}
                onPress={() => this.ToRegister()}
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 330,
    marginBottom: 30,
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
    marginTop: -70,
    marginBottom: 20,
  },

  logo: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 100,
  },
  yellowCircle: {
    height: 400,
    width: 400,
    backgroundColor: "#ffe96b",
    borderRadius: 200,
    position: "absolute",
    marginLeft: -180,
    marginTop: -290,
  },
  greenCircle: {
    backgroundColor: "#65a84d",
    borderRadius: 200,
    width: 400,
    height: 400,
    position: "absolute",
    zIndex: -3,
    marginLeft: 100,
    marginTop: -310,
  },
});

import React from "react";
import firebase from "firebase";
import firetore from "firebase/firestore";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";

import { TextInput, HelperText } from "react-native-paper";

var userId;
export default class RegisterScreen extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    visiblePassword: true,
    visibleRepeatPassword: true,
    registerError: "",
    existAccountLoading: false,
    createAccountLoading: false,
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    passwordError: "",
    repeatPasswordError: "",
    verified: false,
    mode: this.props.mode,
  };

  ToLogin = () => {
    this.props.navigation.navigate("Login");
  };

  capitalizeFirstLetter = (e) => {
    switch (e) {
      case "firstName":
        const { firstName } = this.state;

        this.setState({
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        });
        break;
      case "lastName":
        const { lastName } = this.state;

        this.setState({
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        });
        break;
    }
  };

  register = async () => {
    const { firstName, lastName, email, password, repeatPassword } = this.state;

    var validateAllFields = true;

    //Validate First Name

    if (this.state.firstName === "") {
      validateAllFields = false;
      this.setState({ firstNameError: "This field cannot be empty" });
    } else if (this.state.firstName !== "") {
      if (/^[a-zA-Z]+$/.test(this.state.firstName) === false) {
        validateAllFields = false;
        this.setState({
          firstNameError: "The first name can contain only letters",
        });
      } else {
        this.setState({ firstNameError: "" });
      }
    }

    //Validate Second Name

    if (this.state.lastName === "") {
      validateAllFields = false;
      this.setState({ lastNameError: "This field cannot be empty" });
    } else if (this.state.lastName !== "") {
      if (/^[a-zA-Z]+$/.test(this.state.lastName) === false) {
        validateAllFields = false;
        this.setState({
          lastNameError: "The last name can contain only letters",
        });
      } else {
        this.setState({ lastNameError: "" });
      }
    }

    //Validate email

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@vspartners\.us$/;

    if (this.state.email === "") {
      validateAllFields = false;
      this.setState({ emailError: "This field cannot be empty " });
    } else if (this.state.email !== "") {
      if (emailRegex.test(this.state.email) === false) {
        this.setState({
          emailError: "Your email addres should have @vspartners.us !",
        });
        validateAllFields = false;
      } else {
        this.setState({ emailError: "" });
      }
    }

    //Validate Password

    if (this.state.password === "") {
      validateAllFields = false;
      this.setState({ passwordError: "The password cannot be empty !" });
    } else if (this.state.password !== "") {
      if (/^([a-zA-Z0-9]{6,})$/.test(this.state.password) === false) {
        validateAllFields = false;
        this.setState({
          passwordError: "The password must have at least 6 characters",
        });
      } else {
        this.setState({ passwordError: "" });
      }
    }

    //Validate Repeat Password

    if (this.state.repeatPassword === "") {
      validateAllFields = false;
      this.setState({ repeatPasswordError: "The password cannot be empty !" });
    } else if (this.state.repeatPassword !== "") {
      if (/^([a-zA-Z0-9]{6,})$/.test(this.state.repeatPassword) === false) {
        validateAllFields = false;
        this.setState({
          repeatPasswordError: "The password must have at least 6 characters",
        });
      } else {
        this.setState({ repeatPasswordError: "" });
      }
    }

    if (validateAllFields) {
      var existentAccount = false;

      this.setState({ existAccountLoading: true });
      this.setState({ createAccountLoading: true });

      const accounts = await firebase.firestore().collection("accounts").get();

      this.setState({ existAccountLoading: false });

      for (const doc of accounts.docs) {
        if (email === doc.data().email && password === doc.data().password) {
          existentAccount = true;
        }
      }

      if (existentAccount === true) {
        this.setState({ registerError: "This account already exists !" });
        this.setState({ firstName: "" });
        this.setState({ lastName: "" });
        this.setState({ email: "" });
        this.setState({ password: "" });
        this.setState({ repeatPassword: "" });
      } else {
        //Create firebase user with email and password
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((result) => {
            result.user.sendEmailVerification();
          });

        await firebase
          .firestore()
          .collection("accounts")
          .doc(this.state.email)
          .set({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            userId: "",
            avatar: "",
            phoneNumber: null,
            verified: false,
          });

        const userId = firebase.auth().currentUser.uid;

        await firebase
          .firestore()
          .collection("accounts")
          .doc(this.state.email)
          .update({
            userId: userId,
          });

        this.setState({ createAccountLoading: false });
        Alert.alert("Success", "Account succesfully created", [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate("Login"),
          },
        ]);

        //Also create document object with the user info
      }
    } else {
      return;
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={[
          styles.container,
          {
            backgroundColor:
              this.state.mode === "light" ? "transparent" : "#101010",
          },
        ]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : null}
      >
        <StatusBar
          animated={true}
          barStyle={
            this.state.mode === "light" ? "dark-content" : "light-content"
          }
          showHideTransition="fade"
          hidden={false}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Image
              source={require("../assets/green_circle.png.png")}
              style={styles.greenCircle}
            ></Image>
            <Image
              source={require("../assets/Yellow_icon.svg.png")}
              style={styles.yellowCircle}
            ></Image>

            <Text
              style={[
                styles.registerMessage,
                { color: this.state.mode === "light" ? "black" : "white" },
              ]}
            >
              Register account
            </Text>

            <View style={styles.form}>
              <View>
                <TextInput
                  outlineColor={this.state.mode === "light" ? "black" : "white"}
                  theme={{
                    colors: {
                      primary: "#258e25",
                      text: this.state.mode === "light" ? "black" : "white",
                      placeholder:
                        this.state.mode === "light" ? "black" : "white",
                    },
                  }}
                  style={{
                    backgroundColor:
                      this.state.mode === "light" ? "white" : "#404040",
                  }}
                  underlineColor="#f5f5f5"
                  underlineColorAndroid="#f5f5f5"
                  placeholderTextColor={
                    this.state.mode === "light" ? "black" : "white"
                  }
                  mode="outlined"
                  onBlur={() => this.capitalizeFirstLetter("firstName")}
                  label="First name"
                  onChangeText={(firstName) => this.setState({ firstName })}
                  value={this.state.firstName}
                ></TextInput>
                <HelperText type="error">
                  {this.state.firstNameError}
                </HelperText>
              </View>

              <View style={{ marginTop: 10 }}>
                <TextInput
                  outlineColor={this.state.mode === "light" ? "black" : "white"}
                  theme={{
                    colors: {
                      primary: "#258e25",
                      text: this.state.mode === "light" ? "black" : "white",
                      placeholder:
                        this.state.mode === "light" ? "black" : "white",
                    },
                  }}
                  style={{
                    backgroundColor:
                      this.state.mode === "light" ? "white" : "#404040",
                  }}
                  underlineColor="#f5f5f5"
                  underlineColorAndroid="#f5f5f5"
                  placeholderTextColor={
                    this.state.mode === "light" ? "black" : "white"
                  }
                  mode="outlined"
                  label="Last name"
                  onBlur={() => this.capitalizeFirstLetter("lastName")}
                  onChangeText={(lastName) => this.setState({ lastName })}
                  value={this.state.lastName}
                ></TextInput>
                <HelperText type="error">{this.state.lastNameError}</HelperText>
              </View>

              <View style={{ marginTop: 10 }}>
                <TextInput
                  outlineColor={this.state.mode === "light" ? "black" : "white"}
                  theme={{
                    colors: {
                      primary: "#258e25",
                      text: this.state.mode === "light" ? "black" : "white",
                      placeholder:
                        this.state.mode === "light" ? "black" : "white",
                    },
                  }}
                  style={{
                    backgroundColor:
                      this.state.mode === "light" ? "white" : "#404040",
                  }}
                  underlineColor="#f5f5f5"
                  underlineColorAndroid="#f5f5f5"
                  placeholderTextColor={
                    this.state.mode === "light" ? "black" : "white"
                  }
                  mode="outlined"
                  label="Email "
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  right={
                    <TextInput.Icon
                      name="email"
                      color={this.state.mode === "light" ? "black" : "white"}
                    />
                  }
                />
                <HelperText type="error">{this.state.emailError}</HelperText>
              </View>

              <View style={{ marginTop: 10 }}>
                <TextInput
                  outlineColor={this.state.mode === "light" ? "black" : "white"}
                  theme={{
                    colors: {
                      primary: "#258e25",
                      text: this.state.mode === "light" ? "black" : "white",
                      placeholder:
                        this.state.mode === "light" ? "black" : "white",
                    },
                  }}
                  style={{
                    backgroundColor:
                      this.state.mode === "light" ? "white" : "#404040",
                  }}
                  underlineColor="#f5f5f5"
                  underlineColorAndroid="#f5f5f5"
                  placeholderTextColor={
                    this.state.mode === "light" ? "black" : "white"
                  }
                  mode="outlined"
                  label="Password"
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  secureTextEntry={this.state.visiblePassword}
                  right={
                    <TextInput.Icon
                      name={this.state.visiblePassword ? "eye-off" : "eye"}
                      forceTextInputFocus={false}
                      onPress={() =>
                        this.setState({
                          visiblePassword: !this.state.visiblePassword,
                        })
                      }
                      color={this.state.mode === "light" ? "black" : "white"}
                    />
                  }
                ></TextInput>
                <HelperText type="error">{this.state.passwordError}</HelperText>
              </View>

              <View style={{ marginTop: 10 }}>
                <TextInput
                  outlineColor={this.state.mode === "light" ? "black" : "white"}
                  theme={{
                    colors: {
                      primary: "#258e25",
                      text: this.state.mode === "light" ? "black" : "white",
                      placeholder:
                        this.state.mode === "light" ? "black" : "white",
                    },
                  }}
                  style={{
                    backgroundColor:
                      this.state.mode === "light" ? "white" : "#404040",
                  }}
                  underlineColor="#f5f5f5"
                  underlineColorAndroid="#f5f5f5"
                  placeholderTextColor={
                    this.state.mode === "light" ? "black" : "white"
                  }
                  mode="outlined"
                  label="Repeat password"
                  onChangeText={(repeatPassword) =>
                    this.setState({ repeatPassword })
                  }
                  value={this.state.repeatPassword}
                  secureTextEntry={this.state.visibleRepeatPassword}
                  right={
                    <TextInput.Icon
                      name={
                        this.state.visibleRepeatPassword ? "eye-off" : "eye"
                      }
                      forceTextInputFocus={false}
                      onPress={() =>
                        this.setState({
                          visibleRepeatPassword:
                            !this.state.visibleRepeatPassword,
                        })
                      }
                      color={this.state.mode === "light" ? "black" : "white"}
                    />
                  }
                ></TextInput>
                <HelperText type="error">
                  {this.state.repeatPasswordError}
                </HelperText>
              </View>
            </View>

            <View style={styles.existentAccountError}>
              <Text style={{ color: "#ff0000" }}>
                {this.state.registerError}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => this.register()}
              >
                {this.state.existAccountLoading ? (
                  <ActivityIndicator color="white"></ActivityIndicator>
                ) : (
                  <Text style={{ color: "#FFF" }}>Create account</Text>
                )}
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  marginTop: 32,
                  marginBottom: 80,
                }}
                onPress={() => this.ToLogin()}
              >
                <Text
                  style={{
                    color: this.state.mode === "light" ? "black" : "white",
                  }}
                >
                  Already have an account ?,{" "}
                  <Text style={{ color: "#258e25", fontWeight: "700" }}>
                    Login here
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
  registerMessage: {
    marginTop: -20,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 150,
    marginBottom: 20,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },

  registerButton: {
    marginHorizontal: 30,
    backgroundColor: "#258e25",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  existentAccountError: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
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

import React from "react";
import firebase from "firebase";
import firetore from "firebase/firestore";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

export default class RegisterScreen extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    registerError: "",
    existAccountLoading: false,
    createAccountLoading: false,
  };

  register = async () => {
    const { firstName, lastName, email, password, repeatPassword } = this.state;

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
    } else {
      const fullName = lastName + " " + firstName;
      firebase.firestore().collection("accounts").doc(fullName).set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      this.setState({ createAccountLoading: false });
      Alert.alert("Success", "Account succesfully created", [
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("Login"),
        },
      ]);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require("../assets/green_circle.png.png")}
            style={styles.greenCircle}
          ></Image>
          <Image
            source={require("../assets/Yellow_icon.svg.png")}
            style={styles.yellowCircle}
          ></Image>

          <Text style={styles.registerMessage}>Register account</Text>

          <View style={styles.form}>
            <View>
              <Text>First Name</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                onChangeText={(firstName) => this.setState({ firstName })}
                value={this.state.firstName}
              ></TextInput>
            </View>

            <View>
              <Text style={{ marginTop: 32 }}>Last Name</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                onChangeText={(lastName) => this.setState({ lastName })}
                value={this.state.lastName}
              ></TextInput>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text>Email Address</Text>
              <TextInput
                placeholder="Your email address should have @vspartners.us"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
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

            <View style={{ marginTop: 32 }}>
              <Text>Repat Password</Text>
              <TextInput
                underlineColorAndroid="transparent"
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
                onChangeText={(repeatPassword) =>
                  this.setState({ repeatPassword })
                }
                value={this.state.repeatPassword}
              ></TextInput>
            </View>
          </View>

          <View style={styles.existentAccountError}>
            <Text style={{ color: "#ff0000" }}>{this.state.registerError}</Text>
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
              style={{ alignSelf: "center", marginTop: 22, marginBottom: 20 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text>
                Already have an account ?,{" "}
                <Text style={{ color: "#258e25", fontWeight: "700" }}>
                  Login here
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
  registerMessage: {
    marginTop: 32,
    fontSize: 28,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 150,
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

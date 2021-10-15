import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default class RegisterScreen extends React.Component {
  state = {
    email: "",
    password: "",
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.registerMessage}>Register account</Text>

          <View style={styles.form}>
            <View>
              <Text>First Name</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>

            <View>
              <Text style={{ marginTop: 32 }}>Last Name</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.input}
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text>Email Address</Text>
              <TextInput
                placeholder="Your email address should have @vspartners.us"
                underlineColorAndroid="transparent"
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
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
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              ></TextInput>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.props.navigation.navigate("Home")}
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

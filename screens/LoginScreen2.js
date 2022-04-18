import React, { useState, useLayoutEffect } from "react";
import firebase from "firebase";
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
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { useDispatch } from "react-redux";
import { HelperText, TextInput } from "react-native-paper";
import { setUserAvatar, setUserEmail, setUserName } from "../redux/user/user";
import { useSelector } from "react-redux";

const client = StreamChat.getInstance(API_KEY);

const LoginScreen2 = ({ navigation }) => {
  const dispatch = useDispatch();

  const { mode } = useSelector((state) => state.theme);

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inexistentAccountError, setInexistentAccountError] = useState("");
  const [togglePassword, setTogglePassword] = useState(true);
  const [statusColor, setStatusColor] = "#65a84d";
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(true);

  const toRegister = () => {
    setEmail("");
    setPassword("");
    setEmail("");

    navigation.navigate("Register");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: mode === "light" ? "white" : "#282828",
      },
      headerTintColor: mode === "light" ? "black" : "white",
    });
  });

  const connectChatUser = async (id, name, image) => {
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

  const handleLogin = async () => {
    var validateAllFields = true;

    var existentAccount = true;

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@vspartners\.us$/;

    if (email === "") {
      validateAllFields = false;
      setEmailError("This field cannot be empty");
    } else if (email !== "") {
      if (!emailRegex.test(email)) {
        setEmailError("Invalid address !");
        validateAllFields = false;
      } else {
        setEmailError("");
      }
    }

    if (password === "") {
      setPasswordError("This field cannot be empty !");
      validateAllFields = false;
    } else {
      setPasswordError("");
    }

    if (validateAllFields) {
      setLoading(true);
      const query = await firebase.firestore().collection("accounts").get();

      for (const doc of query.docs) {
        if (email === doc.data().email && password === doc.data().password) {
          existentAccount = true;

          dispatch(setUserId(doc.data().userId));

          dispatch(
            setUserName(doc.data().firstName + " " + doc.data().lastName)
          );
          dispatch(setUserAvatar(doc.data().avatar));
          setFirstName(doc.data().firstName);
          setLastName(doc.data().lastName);
          setUserId(doc.data().userId);
          setEmail("");
          setPassword("");
        }
      }

      setLoading(false);

      if (existentAccount) {
        setInexistentAccountError("");

        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("user", email);
        await AsyncStorage.setItem("fullName", firstName + "-" + lastName);

        connectChatUser(userId, firstName + "-" + lastName, avatar);

        navigation.navigate("App", {
          screen: "HomeScreen",
        });

        if (deviceToken) {
          await firebase.firestore().collection("accounts").doc(email).update({
            deviceToken: deviceToken,
          });
        }
      } else {
        setInexistentAccountError("This account does not exist !");
        setStatusColor("#ff0000");
      }
    } else {
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "transparent" : "#101010" },
      ]}
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

          <Text
            style={[
              styles.greeting,
              { color: mode === "light" ? "black" : "white" },
            ]}
          >
            {`Hello partner, \n Welcome back !`}
          </Text>

          <View style={styles.form}>
            <View>
              <TextInput
                outlineColor={mode === "light" ? "black" : "white"}
                theme={{
                  colors: {
                    primary: "#258e25",
                    text: mode === "light" ? "black" : "white",
                    placeholder: mode === "light" ? "black" : "white",
                  },
                }}
                style={{
                  backgroundColor: mode === "light" ? "white" : "#404040",
                }}
                underlineColor="#f5f5f5"
                underlineColorAndroid="#f5f5f5"
                placeholderTextColor={mode === "light" ? "black" : "white"}
                mode="outlined"
                label="Email address"
                onChangeText={(email) => setEmail(email)}
                value={email}
                right={
                  <TextInput.Icon
                    forceTextInputFocus={false}
                    name="email"
                    color={mode === "light" ? "black" : "white"}
                  />
                }
              />
              <HelperText type="error">{emailError}</HelperText>
            </View>

            <View>
              <TextInput
                outlineColor={mode === "light" ? "black" : "white"}
                theme={{
                  colors: {
                    primary: "#258e25",
                    text: mode === "light" ? "black" : "white",
                    placeholder: mode === "light" ? "black" : "white",
                  },
                }}
                style={{
                  backgroundColor: mode === "light" ? "white" : "#404040",
                }}
                underlineColor="#f5f5f5"
                underlineColorAndroid="#f5f5f5"
                placeholderTextColor={mode === "light" ? "black" : "white"}
                mode="outlined"
                label="Password"
                onChangeText={(password) => setPassword(password)}
                value={password}
                secureTextEntry={visiblePassword}
                right={
                  <TextInput.Icon
                    forceTextInputFocus={false}
                    name={visiblePassword ? "eye-off" : "eye"}
                    onPress={() => setVisiblePassword(!visiblePassword)}
                    color={mode === "light" ? "black" : "white"}
                  />
                }
              />
              <HelperText type="error">{passwordError}</HelperText>
            </View>
          </View>

          <View style={styles.errorMessage}>
            <HelperText type="error" style={{ fontSize: 20 }}>
              {inexistentAccountError}
            </HelperText>
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleLogin()}
            >
              {loading ? (
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
              onPress={() => toRegister()}
            >
              <Text style={{ color: mode === "light" ? "black" : "white" }}>
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
};

export default LoginScreen2;

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

import React, { useState } from "react";
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
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { useDispatch } from "react-redux";
import { HelperText, TextInput } from "react-native-paper";

const client = StreamChat.getInstance(API_KEY);

const LoginScreen2 = ({ navigation }) => {
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

  const toRegister = () => {
    setEmail("");
    setPassword("");
    setEmail("");
    setPassword("");

    navigation.navigate("Register");
  };
};

export default LoginScreen2;

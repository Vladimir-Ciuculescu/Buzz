import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import { Camera } from "expo-camera";
import { Card, Title, Divider, Button } from "react-native-paper";
import { useSelector } from "react-redux";

const PostScreen = ({ navigation, color, anticolor }) => {
  const cameraRef = useRef();
  const { name, avatar } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
    };

    fetchUser();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "What's on your mind ?",
      headerTintColor: anticolor,
      presentation: "modal",
      headerStyle: { backgroundColor: color },
      headerLeft: () => (
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={24} color={anticolor} />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View
            style={{
              flexDirection: "row",
              marginRight: 16,
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            <Avatar style={styles.avatar} rounded source={{ uri: avatar }} />

            <Text
              style={{
                marginLeft: 20,
                fontSize: 20,
                marginTop: 13,
                color: anticolor,
              }}
            >
              {name}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: 20,
              marginTop: 40,
              fontWeight: "600",
              fontSize: 17,
              marginBottom: 20,
              color: anticolor,
            }}
          >
            What kind of post are you making ?
          </Text>
          <Card
            onPress={() => {
              navigation.navigate("Poll");
            }}
            style={{ marginHorizontal: 15, backgroundColor: "white" }}
          >
            <Card.Content>
              <Title>Create a poll</Title>
            </Card.Content>
            <Divider />
            <Card.Cover
              style={{ width: "100%" }}
              source={{
                uri: "https://avatars.slack-edge.com/2020-05-09/1112549471909_7543dde099089941d3c3_512.png",
              }}
            />
          </Card>
          <Card
            onPress={() => navigation.navigate("Informational")}
            style={{ marginHorizontal: 15, marginTop: 10 }}
          >
            <Card.Content>
              <Title>Informational post</Title>
            </Card.Content>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: 15,
    marginTop: 20,
    marginHorizontal: 17,
  },

  avatar: {
    width: 48,
    height: 48,
  },
  options: {
    marginHorizontal: 12,
    flexDirection: "row",
    marginLeft: "auto",
    alignItems: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default PostScreen;

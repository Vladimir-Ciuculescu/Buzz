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

const PostScreen = ({ navigation }) => {
  const cameraRef = useRef();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    const fetchUser = async () => {
      const avatar = await AsyncStorage.getItem("avatar");
      const user = await AsyncStorage.getItem("user");
      const query = firebase.firestore().collection("accounts").doc(user).get();
      const firstName = (await query).data().firstName;
      const lastName = (await query).data().lastName;
      setFullName(firstName + " " + lastName);
      setAvatar((await query).data().avatar);
      setAvatar(avatar);
    };

    fetchUser();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "What's on your mind ?",
      presentation: "modal",
      headerLeft: () => (
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const takePicture = async () => {
    const options = { quality: 0.7, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);
    const source = data.base64;

    if (source) {
      await cameraRef.current.pausePreview();
      setIsPreview(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {startCamera ? (
          <Camera ref={cameraRef} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <MaterialIcons name="flip-camera-ios" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture}>
                <Text>Make a photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture}>
                <Text>Make a photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
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

              <Text style={{ marginLeft: 20, fontSize: 20, marginTop: 13 }}>
                {fullName}
              </Text>
            </View>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 40,
                fontWeight: "600",
                fontSize: 17,
                marginBottom: 20,
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
                style={{ width: "70%" }}
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
        )}
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

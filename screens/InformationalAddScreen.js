import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { useSelector } from "react-redux";

import firebase from "firebase";

const InformationalAddScreen = ({ navigation }) => {
  const { mode } = useSelector((state) => state.theme);
  const { width } = useWindowDimensions();
  const cameraRef = useRef();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [userId, setUserId] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: true,
      title: "Make a post",
      headerStyle: {
        backgroundColor: mode === "light" ? "white" : "#282828",
      },
      headerTintColor: mode === "light" ? "black" : "white",

      headerRight: () =>
        loadingPost ? (
          <ActivityIndicator size="small" style={{ marginRight: 10 }} />
        ) : (
          <View style={{ marginRight: 20 }}>
            <TouchableOpacity
              disabled={image === null ? true : false}
              onPress={handlePost}
            >
              <Text
                style={{
                  opacity: image === null && text === "" ? 0.2 : 1,
                  color: mode === "light" ? "black" : "white",
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        ),
    });
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const avatar = await AsyncStorage.getItem("avatar");
      const user = await AsyncStorage.getItem("user");
      const query = firebase.firestore().collection("accounts").doc(user).get();
      const firstName = (await query).data().firstName;
      const lastName = (await query).data().lastName;
      setFullName(firstName + " " + lastName);
      setAvatar((await query).data().avatar);
      setAvatar(avatar);
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const handlePost = async () => {
    setLoadingPost(true);

    const uniqueId = uuidv4();

    await Fire.shared.addPost({
      text: text.trim(),
      localUri: image,
      postId: uniqueId,
    });

    await firebase.firestore().collection("notifications").add({
      owner: fullName,
      uid: userId,
      notificationId: uniqueId,
      notificationType: "informational",
      avatar: avatar,
      timestamp: Date.now(),
      pollText: text,
    });

    setImage(null);
    setLoadingPost(false);
    setText("");

    Alert.alert("Success", "Post succesfully uploaded", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    }
  };

  const takePicture = async () => {
    const options = { quality: 0.7, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);

    setImage(data.uri);

    const source = data.base64;

    if (source) {
      await cameraRef.current.pausePreview();
      setIsPreview(true);
    }
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: mode === "light" ? "transparent" : "#101010" },
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {startCamera ? (
          <Camera ref={cameraRef} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ position: "absolute", top: 20, left: width / 2 - 35 }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <MaterialIcons name="flip-camera-ios" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 70,
                  height: 70,
                  bottom: 30,
                  borderRadius: 50,
                  backgroundColor: "#fff",
                  position: "absolute",
                  left: width / 2 - 55,
                }}
                onPress={takePicture}
              ></TouchableOpacity>
              {isPreview ? (
                <TouchableOpacity
                  onPress={() => cancelPreview()}
                  style={{ left: 20, top: 20, position: "absolute" }}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              ) : null}

              {isPreview ? (
                <TouchableOpacity
                  onPress={() => setStartCamera(false)}
                  style={{ right: 20, top: 20, position: "absolute" }}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ right: 20, top: 20, position: "absolute" }}
                  onPress={() => setStartCamera(false)}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
              )}
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

              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 17,
                  color: mode === "light" ? "dark" : "white",
                }}
              >
                {fullName}
              </Text>

              <View style={styles.options}>
                <TouchableOpacity onPress={pickImage}>
                  <FontAwesome
                    name="photo"
                    size={24}
                    color={mode === "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openCamera}
                  style={{ marginLeft: 20 }}
                >
                  <Entypo
                    name="camera"
                    size={24}
                    color={mode === "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={{ marginTop: 30, marginLeft: 40 }}
              placeholder="What's on your mind ?"
              onChangeText={(e) => setText(e)}
              placeholderTextColor={mode === "light" ? "black" : "white"}
            />
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginTop: 30,
              }}
            >
              <Image
                source={{ uri: image }}
                style={{ height: 230, width: 350, borderRadius: 10 }}
              ></Image>
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};

export default InformationalAddScreen;

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
  text: {
    fontSize: 18,
    color: "white",
  },
});

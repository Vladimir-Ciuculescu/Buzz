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
} from "react-native";
import { Avatar } from "react-native-elements";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase";

const InformationalAddScreen = ({ navigation }) => {
  const cameraRef = useRef();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: true,
      title: "Make a post",
    });
  });

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

  const handlePost = async () => {
    setLoadingPost(true);
    await Fire.shared.addPost({
      text: text.trim(),
      localUri: image,
    });

    setText("");
    setImage(null);
    setLoadingPost(false);

    Alert.alert("Success", "Post succesfully uploaded", [
      {
        text: "OK",
        onPress: () => props.navigation.goBack(),
      },
    ]);
  };

  const pickImage = async () => {
    const avatar = await AsyncStorage.getItem("avatar");
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

              <Text style={{ marginLeft: 20, fontSize: 17 }}>{fullName}</Text>

              <View style={styles.options}>
                <TouchableOpacity onPress={pickImage}>
                  <FontAwesome name="photo" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openCamera}
                  style={{ marginLeft: 20 }}
                >
                  <Entypo name="camera" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput placeholder="What's on your mind ?" />
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

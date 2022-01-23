import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";
import { useState, useEffect, useLayoutEffect } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";

import { Avatar } from "react-native-elements";

import firebase from "firebase";

const PostScreen = ({ navigation }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");

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
      headerRight: () =>
        loadingPost ? (
          <ActivityIndicator
            style={{ marginRight: 20 }}
            color="blue"
          ></ActivityIndicator>
        ) : (
          <View style={{ marginRight: 20 }}>
            <TouchableOpacity onPress={handlePost}>
              <Text style={{ color: "blue" }}>Post</Text>
            </TouchableOpacity>
          </View>
        ),
    });
  });

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

  return (
    <View style={styles.container}>
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
            <TouchableOpacity style={{ marginLeft: 20 }}>
              <Entypo name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          placeholder="What do you want to share with others ?"
          multiline={true}
          autoFocus={true}
          numberOfLines={4}
          style={styles.question}
          onChangeText={(text) => setText(text)}
          value={text}
        ></TextInput>

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
            style={{ height: 500, width: 330, borderRadius: 10 }}
          ></Image>
        </View>
      </View>
      <View />
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
    borderRadius: 24,
  },
  options: {
    marginHorizontal: 12,
    flexDirection: "row",
    marginLeft: "auto",
    alignItems: "center",
  },
});

export default PostScreen;

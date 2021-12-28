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

import Constants from "expo-constants";

const firebase = require("firebase");
require("firebase/firestore");

export default class PostScreen extends React.Component {
  state = {
    text: "",
    image: null,
    loadingPost: false,
    mode: "contain",
    onlyScaleDown: false,
  };

  componentDidMount() {
    this.getPhotoPermission();
  }

  getPhotoPermission = async () => {
    if (Constants.platform.android) {
      //const { status } = await Permissions.askAsync(Permissions.CAMERA);
      //const { status } = await Camera.requestPermissionsAsync();
      //alert(status);
    }
  };

  handlePost = async () => {
    this.setState({ loadingPost: true });
    await Fire.shared.addPost({
      text: this.state.text.trim(),
      localUri: this.state.image,
    });

    this.setState({ text: "", image: null });

    this.setState({ loadingPost: false });

    Alert.alert("Success", "Post succesfully uploaded", [
      {
        text: "OK",
        onPress: () => this.props.navigation.goBack(),
      },
    ]);
  };

  pickImage = async () => {
    const avatar = await AsyncStorage.getItem("avatar");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="black"></Ionicons>
          </TouchableOpacity>
          <Text style={{}}>Add a new Post</Text>
          {this.state.loadingPost ? (
            <ActivityIndicator color="green"></ActivityIndicator>
          ) : (
            <TouchableOpacity onPress={this.handlePost}>
              <Text style={{ fontWeight: "800" }}>Post</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{
                uri: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
              }}
              style={styles.avatar}
            ></Image>
            <TextInput
              placeholder="What do you want to share with others ?"
              multiline={true}
              autoFocus={true}
              numberOfLines={4}
              style={styles.question}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            ></TextInput>
          </View>

          <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
            <FontAwesome name="camera" size={24} color="#D8D9DB" />
          </TouchableOpacity>
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 30,
            }}
          >
            <Image
              source={{ uri: this.state.image }}
              style={{ height: 200, width: 330 }}
            ></Image>
          </View>
        </View>
        <View />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  question: {
    fontSize: 15,
  },
  cardOption: {
    paddingHorizontal: 20,
    height: 330,
    width: 330,
    alignSelf: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    marginLeft: 20,
    marginTop: 20,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 12,
  },
});

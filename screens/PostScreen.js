import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ImageBackground,
  PermissionsAndroid,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Camera from "expo-camera";

const image = {
  uri: "https://belgrade-free-walking-tour.com/wp-content/uploads/2016/04/Fotolia_4887928_Subscription_Monthly_M-1.jpg",
};

export default class PostScreen extends React.Component {
  state = {
    text: "",
    image: null,
  };

  componentDidMount() {
    this.getPhotoPermission();
  }

  getPhotoPermission = async () => {
    if (Constants.platform.android) {
      //const { status } = await Permissions.askAsync(Permissions.CAMERA);
      const { status } = await Camera.requestCameraPermissionsAsync();
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="black"></Ionicons>
          </TouchableOpacity>
          <Text style={{}}>Add a new Post</Text>
          <TouchableOpacity>
            <Text style={{ fontWeight: "800" }}>Post</Text>
          </TouchableOpacity>
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
            ></TextInput>
          </View>

          <TouchableOpacity
            style={styles.photo}
            onPress={this.getPhotoPermission}
          >
            <FontAwesome name="camera" size={24} color="D8D9DB" />
          </TouchableOpacity>

          <ImageBackground
            source={image}
            style={styles.image}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View
              style={{
                position: "absolute",
                paddingTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 20, opacity: 1 }}>
                Carting
              </Text>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 40,
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
  image: {
    flex: 1,
    width: 100,
    height: 100,
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

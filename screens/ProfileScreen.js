import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  AsyncStorage,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Button, Caption, Title } from "react-native-paper";
import firebase from "firebase";
import firetore from "firebase/firestore";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import EditProfileModal from "./EditProfileModal";
import UserPermission from "../utilities/UserPersmission";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.getUser();
    this.state = {
      user: "",
      email: "",
      avatar: "",
      toggleEditProfile: false,
      avatar: null,
    };
  }

  PickAvatar = async () => {
    /*
    if (Constants.platform.android) {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      alert(status);
    }*/

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ avatar: result.uri });
    }
  };

  getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    this.setState({ email: user });
    console.log(user);
    const query = firebase.firestore().collection("accounts").doc(user).get();
    const firstName = (await query).data().firstName;
    const lastName = (await query).data().lastName;
    const fullName = firstName + " " + lastName;
    this.setState({ user: fullName });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accountHeader}>
          <View style={{ flexDirection: "row" }}>
            <Avatar.Image
              source={{
                uri: "https://api,adorable.io/avatars/80/abott@adorable.png",
              }}
              size={80}
            />
            <View style={styles.captionSection}>
              <Title style={{ fontSize: 24, marginTop: 15 }}>
                {this.state.user}
              </Title>
            </View>
          </View>
          <View style={styles.accountInfo}>
            <View style={{ flexDirection: "row" }}>
              <Feather name="mail" size={24} color="black" />
              <Text style={{ marginLeft: 5, textAlignVertical: "center" }}>
                {this.state.email}
              </Text>
            </View>
          </View>
        </View>

        <Button
          icon="pencil"
          mode="contained"
          style={styles.editProfile}
          onPress={() =>
            this.setState({
              toggleEditProfile: true,
            })
          }
        >
          Edit Profile
        </Button>
        <Modal animationType="slide" visible={this.state.toggleEditProfile}>
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => this.setState({ toggleEditProfile: false })}
            >
              <Text style={{ fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              Edit Profile
            </Text>

            <TouchableOpacity
              onPress={() => this.setState({ toggleEditProfile: false })}
            >
              <Text
                style={{ fontSize: 16, color: "#65a84d", fontWeight: "700" }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={70} color="black" />
            </TouchableOpacity>
            <Image source={{ uri: this.state.avatar }} />
            <TouchableOpacity onPress={this.PickAvatar}>
              <Text style={{ color: "#65a84d" }}>Choose a profile picture</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountHeader: {
    marginTop: 60,
    marginLeft: 20,
  },
  captionSection: {
    marginLeft: 20,
    marginTop: 10,
  },
  accountInfo: {
    marginTop: 20,
    marginLeft: 15,
  },
  editProfile: {
    marginHorizontal: 30,
    marginTop: 20,
    backgroundColor: "#65a84d",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  photoSection: {
    alignItems: "center",
    marginTop: 20,
  },
});

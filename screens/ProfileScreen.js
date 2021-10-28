import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  AsyncStorage,
  StyleSheet,
  Modal,
  Image,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { Avatar, Button, Caption, Title } from "react-native-paper";
import firebase from "firebase";
import firetore from "firebase/firestore";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";

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
      firstName: "",
      lastName: "",
      phoneNumber: null,
      country: "uk",
      loadingEditProfile: false,
    };
  }

  Logout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out ?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          this.props.navigation.navigate("Login");
        },
      },
    ]);
  };

  PickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      //this.setState({ avatar: result.uri });
      this.setState({ avatar: result.uri });
    }
  };

  updateProfile = async () => {
    console.log(this.state.user);
    this.setState({ loadingEditProfile: true });

    await Fire.shared.addAvatar({
      localUri: this.state.avatar,
      user: this.state.email,
    });

    await firebase
      .firestore()
      .collection("accounts")
      .doc(this.state.email)
      .update({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phoneNumber: this.state.phoneNumber,
      });

    this.setState({ loadingEditProfile: false });

    this.setState({ toggleEditProfile: false });
  };

  getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    this.setState({ email: user });
    const query = firebase.firestore().collection("accounts").doc(user).get();
    const firstName = (await query).data().firstName;
    const lastName = (await query).data().lastName;
    const fullName = firstName + " " + lastName;
    const avatar = (await query).data().avatar;
    this.setState({ user: fullName });
    this.setState({ firstName: firstName });
    this.setState({ lastName: lastName });
    this.setState({ avatar: avatar });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.headerSection}>
                <TouchableOpacity
                  onPress={() => this.setState({ toggleEditProfile: false })}
                >
                  <Text style={{ fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 16, fontWeight: "700" }}>
                  Edit Profile
                </Text>

                <TouchableOpacity onPress={() => this.updateProfile()}>
                  {this.state.loadingEditProfile ? (
                    <ActivityIndicator color="green"></ActivityIndicator>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#65a84d",
                        fontWeight: "700",
                      }}
                    >
                      Done
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.avatar}>
                  {this.state.avatar ? (
                    <Image
                      source={{ uri: this.state.avatar }}
                      style={{ height: 100, width: 100, borderRadius: 50 }}
                    />
                  ) : (
                    <Image
                      source={require("./../assets/profile.png")}
                      style={{ height: 100, width: 100 }}
                    />
                  )}
                </TouchableOpacity>
                <Image source={{ uri: this.state.avatar }} />
                <TouchableOpacity onPress={this.PickAvatar}>
                  <Text style={{ color: "#65a84d" }}>
                    Choose a profile picture
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.firstNameSection}>
                <Text
                  style={{ color: "#A9A9A9", paddingBottom: 10, fontSize: 18 }}
                >
                  First Name
                </Text>
                <TextInput
                  style={styles.changeTextInput}
                  value={this.state.firstName}
                  placeholder="First Name"
                  onChangeText={(e) => this.setState({ firstName: e })}
                />
              </View>

              <View style={styles.lastNameSection}>
                <Text
                  style={{ color: "#A9A9A9", paddingBottom: 10, fontSize: 18 }}
                >
                  Second Name
                </Text>
                <TextInput
                  style={styles.changeTextInput}
                  value={this.state.lastName}
                  placeholder="Second Name"
                  onChangeText={(e) => this.setState({ secondName: e })}
                />
              </View>

              <View style={styles.phoneNumber}>
                <Text
                  style={{ color: "#A9A9A9", paddingBottom: 10, fontSize: 18 }}
                >
                  Phone number
                </Text>
                <TextInput
                  style={styles.changeTextInput}
                  value={this.state.phoneNumber}
                  keyboardType="numeric"
                  onChangeText={(e) => this.setState({ phoneNumber: e })}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

/*
<TouchableOpacity onPress={() => this.Logout()}>
              <Text style={{ color: "#ff0000" }}>Log out</Text>
            </TouchableOpacity>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  accountHeader: {
    marginTop: 20,
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
  firstNameSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  lastNameSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  phoneNumber: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  role: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  changeTextInput: {
    color: "#000000",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    fontSize: 18,
    paddingBottom: 7,
  },
  picker: {
    marginTop: -80,
  },
});

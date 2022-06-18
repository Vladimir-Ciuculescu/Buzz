import React, { Component, useLayoutEffect } from "react";
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
  Dimensions,
} from "react-native";

import { Button, Title } from "react-native-paper";
import firebase from "firebase";
import { Feather } from "@expo/vector-icons";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { Shadow } from "react-native-shadow-2";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";
import { setUserAvatar } from "../redux/user/user";
import { useDispatch } from "react-redux";

const windowHeight = Dimensions.get("window").height;

const ProfileScreen2 = ({ navigation, color, anticolor }) => {
  const { name, avatar } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [Avatar, setAvatar] = useState("");
  const [toggleEditProfile, settoggleEditProfile] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loadingEditProfile, setLoadingEditProfile] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Profile",
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={24} color={anticolor} />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingEditProfile(true);
      const user = await AsyncStorage.getItem("user");
      const avatar = await AsyncStorage.getItem("avatar");
      setAvatar(avatar);
      console.log(Avatar);
      setEmail(user);
      const query = firebase.firestore().collection("accounts").doc(user).get();
      const firstName = (await query).data().firstName;
      const lastName = (await query).data().lastName;
      const fullName = firstName + " " + lastName;
      setUser(fullName);
      setfirstName(firstName);
      setLastName(lastName);
      setLoadingEditProfile(false);
    };

    fetchUser();
  }, []);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  const updateProfile = async () => {
    setLoadingEditProfile(true);

    await Fire.shared.addAvatar({
      localUri: Avatar,
      user: email,
    });

    await firebase.firestore().collection("accounts").doc(email).update({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });

    dispatch(setUserAvatar(Avatar));

    setLoadingEditProfile(false);
    settoggleEditProfile(false);
  };

  return (
    <ParallaxScrollView
      backgroundColor={color}
      renderForeground={() => (
        <Image
          source={{
            uri: "https://engineering.fb.com/wp-content/uploads/2016/04/yearinreview.jpg",
          }}
        />
      )}
      renderBackground={() => (
        <View>
          <Image
            style={{
              height: "100%",
              width: "100%",
              opacity: 0.5,
              zIndex: -1,
            }}
            source={{
              uri: Avatar,
            }}
          />
          <View
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              opacity: 0.5,
              width: "100%",
              height: "100%",
            }}
          ></View>
        </View>
      )}
      parallaxHeaderHeight={250}
    >
      <View style={{ backgroundColor: color, height: windowHeight }}>
        <View style={styles.profilePicture}>
          <Shadow>
            <Image
              style={{
                alignSelf: "center",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "white",
              }}
              height={150}
              width={150}
              source={{
                uri: Avatar,
              }}
            />
          </Shadow>
        </View>

        <View style={styles.container}>
          <View style={styles.accountHeader}>
            <View style={styles.captionSection}>
              <Title
                style={{
                  fontSize: 24,
                  marginTop: 15,
                  alignSelf: "center",
                  color: anticolor,
                }}
              >
                {user}
              </Title>
            </View>
            <View style={styles.accountInfo}>
              <View style={{ flexDirection: "row", marginLeft: 20 }}>
                <Feather name="mail" size={24} color={anticolor} />
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 3,
                    textAlignVertical: "center",
                    color: anticolor,
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>
          </View>

          <Button
            icon="pencil"
            mode="contained"
            style={styles.editProfile}
            onPress={() => settoggleEditProfile(true)}
            uppercase={false}
          >
            Edit Profile Picture
          </Button>

          <Modal animationType="slide" visible={toggleEditProfile}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ backgroundColor: color }}>
                <View style={styles.headerSection}>
                  <TouchableOpacity onPress={() => settoggleEditProfile(false)}>
                    <Text style={{ fontSize: 16, color: anticolor }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: anticolor,
                    }}
                  >
                    Edit Profile
                  </Text>

                  <TouchableOpacity onPress={() => updateProfile()}>
                    {loadingEditProfile ? (
                      <ActivityIndicator color="#1a75ff"></ActivityIndicator>
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#1a75ff",
                          fontWeight: "700",
                        }}
                      >
                        Done
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={[styles.photoSection, { backgroundColor: color }]}>
                  <TouchableOpacity style={styles.avatar}>
                    {Avatar ? (
                      <Image
                        source={{ uri: Avatar }}
                        style={{ height: 100, width: 100, borderRadius: 50 }}
                      />
                    ) : (
                      <Image
                        source={require("./../assets/profile.png")}
                        style={{ height: 100, width: 100 }}
                      />
                    )}
                  </TouchableOpacity>
                  <Image source={{ uri: Avatar }} />
                  <TouchableOpacity
                    onPress={() => {
                      pickAvatar();
                    }}
                  >
                    <Text style={{ color: "#1a75ff" }}>
                      Choose a profile picture
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default ProfileScreen2;

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
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  accountHeader: {
    marginTop: 0,
  },
  captionSection: {
    marginTop: 0,
  },
  accountInfo: {
    marginTop: 20,
    marginLeft: 15,
  },
  editProfile: {
    marginHorizontal: 30,
    marginTop: 20,
    backgroundColor: "#1a75ff",
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
    paddingTop: 20,
    height: windowHeight,
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
  profilePicture: {
    marginTop: -40,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
});

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
} from "react-native";

import { StreamChat } from "stream-chat";

import { Button, Title } from "react-native-paper";
import firebase from "firebase";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Fire";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { Shadow } from "react-native-shadow-2";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/core";
import API_KEY from "../StreamCredentials";
import { Center, VStack, Skeleton, HStack } from "native-base";

const client = StreamChat.getInstance(API_KEY);

const ProfileScreen2 = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
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
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingEditProfile(true);
      const user = await AsyncStorage.getItem("user");
      setEmail(user);
      const query = firebase.firestore().collection("accounts").doc(user).get();
      const firstName = (await query).data().firstName;
      const lastName = (await query).data().lastName;
      const fullName = firstName + " " + lastName;
      const avatar = (await query).data().avatar;
      setUser(fullName);
      setfirstName(firstName);
      setLastName(lastName);
      setAvatar(avatar);
      setLoadingEditProfile(false);
    };

    fetchUser();
  }, []);

  if (loadingEditProfile) {
    return (
      <Center w="100%">
        <VStack
          w="100%"
          maxW="400"
          borderWidth="1"
          space={6}
          rounded="md"
          alignItems="center"
          _dark={{
            borderColor: "coolGray.500",
          }}
          _light={{
            borderColor: "coolGray.200",
          }}
        >
          <Skeleton h="250" />
          <Skeleton
            borderWidth={1}
            borderColor="coolGray.200"
            endColor="warmGray.50"
            size="150"
            rounded="2xl"
            mt="-70"
          />
          <HStack space="2">
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
            <Skeleton size="5" rounded="full" />
          </HStack>
          <Skeleton.Text lines={3} alignItems="center" px="12" />
          <Skeleton mb="3" w="40" rounded="20" />
        </VStack>
      </Center>
    );
  } else {
    return (
      <ParallaxScrollView
        backgroundColor="white"
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
                uri: avatar,
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
        <View>
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
                  uri: avatar,
                }}
              />
            </Shadow>
          </View>

          <View style={styles.container}>
            <View style={styles.accountHeader}>
              <View style={styles.captionSection}>
                <Title
                  style={{ fontSize: 24, marginTop: 15, alignSelf: "center" }}
                >
                  {user}
                </Title>
              </View>
              <View style={styles.accountInfo}>
                <View style={{ flexDirection: "row" }}>
                  <Feather name="mail" size={24} color="black" />
                  <Text style={{ marginLeft: 5, textAlignVertical: "center" }}>
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
            >
              Edit Profile Picture
            </Button>

            <Modal animationType="slide" visible={toggleEditProfile}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <View style={styles.headerSection}>
                    <TouchableOpacity
                      onPress={() => settoggleEditProfile(false)}
                    >
                      <Text style={{ fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      Edit Profile
                    </Text>

                    <TouchableOpacity onPress={() => this.updateProfile()}>
                      {loadingEditProfile ? (
                        <ActivityIndicator color="green"></ActivityIndicator>
                      ) : (
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#65a84d",
                            fontWeight: "700",
                          }}
                        >
                          Done x``
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.photoSection}>
                    <TouchableOpacity style={styles.avatar}>
                      {avatar ? (
                        <Image
                          source={{ uri: avatar }}
                          style={{ height: 100, width: 100, borderRadius: 50 }}
                        />
                      ) : (
                        <Image
                          source={require("./../assets/profile.png")}
                          style={{ height: 100, width: 100 }}
                        />
                      )}
                    </TouchableOpacity>
                    <Image source={{ uri: avatar }} />
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={{ color: "#65a84d" }}>
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
  }
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
  profilePicture: {
    marginTop: -40,
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
});

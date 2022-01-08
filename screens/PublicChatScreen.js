import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import firetore from "firebase/firestore";
import { Entypo, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { TextInput as Input } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const PublicChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AsyncStorage.getItem("user");
      const currentAvatar = await AsyncStorage.getItem("avatar");
      setUser(currentUser);
      setAvatar(currentAvatar);
    };

    fetchUser();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="arrowleft"
            size={24}
            color="blue"
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
            }}
          />
          <Text style={{ marginLeft: 10, fontWeight: "800" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  const sendMessage = async () => {
    const firstName = await AsyncStorage.getItem("firstName");
    const lastName = await AsyncStorage.getItem("lastName");

    Keyboard.dismiss();

    await firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: user,
        name: firstName + " " + lastName,
        photo: avatar,
      });

    setInput("");
  };

  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
  };

  useLayoutEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar></StatusBar>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <React.Fragment>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {messages.map(({ id, data }) =>
                data.displayName === user ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      rounded
                      bottom={-15}
                      right={-5}
                      size={30}
                      source={{ uri: avatar }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      bottom={-15}
                      left={-5}
                      rounded
                      size={30}
                      source={{ uri: data.photo }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <Input
                placeholder="Send a message"
                value={input}
                onChangeText={(text) => setInput(text)}
                theme={{
                  colors: {
                    primary: "transparent",
                    text: "grey",
                    activeUnderlineColor: "transparent",
                    activeColor: "transparent",
                  },
                }}
                underlineColor="transparent"
                selectionColor="blue"
                multiline={true}
                style={{
                  width: "93%",
                  height: 50,
                  borderRadius: 30,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  marginRight: 10,
                }}
                left={
                  <Input.Icon
                    forceTextInputFocus={false}
                    name={() => (
                      <Entypo name="emoji-happy" size={24} color="black" />
                    )}
                  />
                }
                right={
                  <Input.Icon
                    disabled={true}
                    style={{ width: 100, left: -25 }}
                    forceTextInputFocus={false}
                    name={() => (
                      <View style={{ flexDirection: "row" }}>
                        <MaterialIcons
                          onPress={openGallery}
                          style={{ marginRight: 20 }}
                          name="add-photo-alternate"
                          size={24}
                          color="black"
                        />
                        <FontAwesome
                          name="microphone"
                          size={24}
                          color="black"
                        />
                      </View>
                    )}
                  />
                }
              />

              <TouchableOpacity
                disabled={input === "" ? true : false}
                onPress={sendMessage}
                activeOpacity={0.5}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={input === "" ? "#a3bef5" : "#2B68E6"}
                />
              </TouchableOpacity>
            </View>
          </React.Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PublicChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 30,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});

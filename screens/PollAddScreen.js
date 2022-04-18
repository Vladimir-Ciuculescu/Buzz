import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as Input,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  AsyncStorage,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Headline, TextInput, List, Chip } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSelector } from "react-redux";

const PollAddScreen = ({ navigation }) => {
  const { mode } = useSelector((state) => state.theme);
  const [subjectInput, setSubjectInput] = useState("");
  const [userId, setUserId] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const [docId, setDocId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollType, setPollType] = useState("Single select");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  const Types = [
    { type: "Single select", icon: "info" },
    { type: "Multiple select", icon: "info" },
  ];

  useEffect(() => {
    const getUser = async () => {
      const user = await AsyncStorage.getItem("user");
      const avatar = await AsyncStorage.getItem("avatar");

      const query = await firebase
        .firestore()
        .collection("accounts")
        .doc(user)
        .get();

      setFullName(query.data().firstName + " " + query.data().lastName);
      setAvatar(avatar);
    };

    getUser();
  }, []);

  const handlePost = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");
    setUserId(userId);

    const UniqueId = uuidv4();
    setUniqueId(UniqueId);

    await firebase
      .firestore()
      .collection("posts")
      .add({
        text: subjectInput,
        type: "poll",
        totalVotes: 0,
        uid: userId,
        timestamp: Date.now(),
        pollType: pollType,
        postId: UniqueId,
      })
      .then((docRef) => {
        setDocId(docRef.id);
      });

    setLoading(false);

    setSubjectInput("");
    setOptions([]);
    setOptionInput("");

    Alert.alert("Success ", "Your poll was succesfully submitted !", [
      {
        text: "Great !",
        onPress: () => navigation.goBack(),
        style: "cancel",
      },
    ]);
  };

  useEffect(() => {
    const addNotification = async () => {
      await firebase.firestore().collection("notifications").doc(docId).set({
        owner: fullName,
        uid: userId,
        notificationId: docId,
        notificationType: "poll",
        notificationPollType: pollType,
        avatar: avatar,
        timestamp: Date.now(),
        pollText: subjectInput,
      });
    };

    addNotification();
  }, [docId]);

  useEffect(() => {
    options.map((item) => {
      addDocOption(item);
    });
  }, [docId]);

  const addDocOption = async (option) => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(docId)
      .collection("options")
      .doc(option)
      .set({
        option: option,
        votes: 0,
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator
            size="small"
            style={{ marginRight: 10 }}
            color={mode === "light" ? "black" : "white"}
          ></ActivityIndicator>
        ) : (
          <View style={{ marginRight: 20 }}>
            <TouchableOpacity
              disabled={
                subjectInput === "" && options.length === 0 ? true : false
              }
              onPress={handlePost}
            >
              <Text
                style={{
                  color: "blue",
                  opacity:
                    subjectInput !== "" && options.length !== 0 ? 1 : 0.2,
                  color: mode === "light" ? "black" : "white",
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        ),
      title: "Make a post",
      headerStyle: {
        backgroundColor: mode === "light" ? "white" : "#282828",
      },
      headerTintColor: mode === "light" ? "black" : "white",
    });
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          backgroundColor: mode === "light" ? "transparent" : "#101010",
          flex: 1,
        }}
      >
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 70,
            backgroundColor: mode === "light" ? "transparent" : "#101010",
          }}
        >
          {Types.map((item) => (
            <Chip
              icon="poll"
              selected={item.type === pollType}
              onPress={() => setPollType(item.type)}
              style={{
                backgroundColor: mode === "light" ? "#D0D0D0" : "#404040",
                borderColor:
                  mode === "light"
                    ? item.type === pollType
                      ? "black"
                      : "white"
                    : item.type !== pollType
                    ? "black"
                    : "white",
              }}
              selectedColor={mode === "light" ? "black" : "white"}
            >
              {item.type}
            </Chip>
          ))}
        </View>
        <Input
          style={[
            styles.Input,
            { color: mode === "light" ? "black" : "white" },
          ]}
          value={subjectInput}
          onChangeText={(e) => setSubjectInput(e)}
          placeholder="Propose something"
          placeholderTextColor={mode === "light" ? "black" : "white"}
        />
        {options.map((option) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 30,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontWeight: "700",
                color: mode === "light" ? "black" : "white",
              }}
            >
              {option}
            </Text>
            <AntDesign
              style={{
                position: "absolute",
                right: 0,
                marginRight: 30,
              }}
              name="close"
              size={24}
              color={mode === "light" ? "black" : "white"}
              onPress={() =>
                setOptions(options.filter((item) => item !== option))
              }
            />
          </View>
        ))}
        <TextInput
          outlineColor={mode === "light" ? "black" : "white"}
          activeOutlineColor={mode === "light" ? "black" : "white"}
          onChangeText={(e) => {
            setOptionInput(e);
          }}
          theme={{
            colors: {
              text: mode === "light" ? "black" : "white",
              accent: "#ffffff",
              placeholder: mode === "light" ? "black" : "white",
            },
          }}
          underlineColor="#f5f5f5"
          underlineColorAndroid="#f5f5f5"
          placeholderTextColor={mode === "light" ? "black" : "white"}
          multiline
          mode="outlined"
          value={optionInput}
          label="Add option"
          style={[
            styles.subjectInput,
            { backgroundColor: mode === "light" ? "white" : "#404040" },
          ]}
          right={
            <TextInput.Icon
              disabled={optionInput !== "" ? false : true}
              color={mode === "light" ? "black" : "white"}
              name="plus"
              onPress={() => {
                setOptions((prevoptions) => [...prevoptions, optionInput]);
                setOptionInput("");
              }}
            />
          }
        ></TextInput>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PollAddScreen;

const styles = StyleSheet.create({
  subjectInput: {
    marginHorizontal: 20,
    fontSize: 20,
    paddingLeft: 5,
    marginTop: 50,
  },
  Input: {
    marginTop: 20,
    marginHorizontal: 30,
    fontSize: 20,
    marginBottom: 40,
  },
});

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
} from "react-native";
import { Headline, TextInput, List, Chip } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import { v4 as uuidv4 } from "uuid";

const PollAddScreen = ({ navigation }) => {
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

    console.log(docId);

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
        avatar: avatar,
        timestamp: Date.now(),
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
            color="#6201ef"
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
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        ),
    });
  });

  return (
    <View>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 70,
        }}
      >
        {Types.map((item) => (
          <Chip
            mode="outlined"
            icon="poll"
            selected={item.type === pollType}
            selectedColor="blue"
            onPress={() => setPollType(item.type)}
          >
            {item.type}
          </Chip>
        ))}
      </View>
      <Input
        style={styles.Input}
        value={subjectInput}
        onChangeText={(e) => setSubjectInput(e)}
        placeholder="Propose something"
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
          <Text style={{ marginBottom: 10, fontWeight: "700" }}>{option}</Text>
          <AntDesign
            style={{
              position: "absolute",
              right: 0,
              marginRight: 30,
            }}
            name="close"
            size={24}
            color="black"
            onPress={() =>
              setOptions(options.filter((item) => item !== option))
            }
          />
        </View>
      ))}
      <TextInput
        theme={{
          colors: {
            primary: "blue",
            underlineColor: "transparent",
          },
        }}
        onChangeText={(e) => {
          setOptionInput(e);
        }}
        multiline
        mode="outlined"
        value={optionInput}
        label="Add option"
        style={styles.subjectInput}
        right={
          <TextInput.Icon
            disabled={optionInput !== "" ? false : true}
            color="blue"
            name="plus"
            onPress={() => {
              setOptions((prevoptions) => [...prevoptions, optionInput]);
              setOptionInput("");
            }}
          />
        }
      ></TextInput>
    </View>
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

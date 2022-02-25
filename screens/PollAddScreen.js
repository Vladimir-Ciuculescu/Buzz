import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as Input,
  Text,
  TouchableOpacity,
} from "react-native";
import { Headline, TextInput, List } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";

const PollAddScreen = ({ navigation }) => {
  const [subjectInput, setSubjectInput] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const [docId, setDocId] = useState("");
  const [posts, setPosts] = useState(null);
  useEffect((_) => {
    setPosts(firebase.firestore().collection("posts"));
  });

  const handlePost = async () => {
    await posts
      .add({
        text: subjectInput,
        type: "poll",
        totalVotes: 0,
      })
      .then((docRef) => {
        setDocId(docRef.id);
      });
  };

  useEffect(() => {
    options.map((item) => {
      addDocOption(item);
    });
  }, [docId]);

  const addDocOption = async (option) => {
    await posts.doc(docId).collection("options").doc(option).set({
      option: option,
      votes: 0,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
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
                opacity: subjectInput !== "" && options.length !== 0 ? 1 : 0.2,
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
            style={{ position: "absolute", right: 0, marginRight: 30 }}
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
        onChangeText={(e) => {
          setOptionInput(e);
        }}
        multiline
        value={optionInput}
        placeholder="Add option"
        style={styles.subjectInput}
        right={
          <TextInput.Icon
            disabled={optionInput !== "" ? false : true}
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

import React, { useEffect, useState, useLayoutEffect } from "react";
import { AsyncStorage, StyleSheet, Dimensions, View } from "react-native";
import { useRoute } from "@react-navigation/core";
import firebase from "firebase";
import { Card, Paragraph, Chip } from "react-native-paper";
import { CheckBox } from "react-native-elements";
import ProgressBar from "react-native-animated-progress";

const screenWidth = Dimensions.get("window").width;

const UpdateMultipleSelectPollScreen = ({ navigation }) => {
  const route = useRoute();
  const postId = route.params.postId;

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userId, setUserId] = useState("");
  const [pollType, setPollType] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Poll",
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener("focus", async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserId(userId);

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .get()
        .then((result) => {
          setTotalVotes(result.data().totalVotes);
          setText(result.data().text);
          setPollType(result.data().pollType);
        });

      const Options = [];

      console.log(totalVotes);

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .get()
        .then((snapShot) => {
          snapShot.docs.forEach((doc) => {
            Options.push({
              option: doc.data().option,
              votes: doc.data().votes,
            });
          });
        });

      setOptions(Options);

      const selectedOptionsDoc = await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .get();

      if (selectedOptionsDoc.exists) {
        setSelectedOptions(selectedOptionsDoc.data().selectedOptions);
      }
    });
  }, []);

  const Vote = async (option) => {
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    //If the option is already in the selected ones
    if (selectedOptions.includes(option)) {
      setTotalVotes(totalVotes - 1);
      setSelectedOptions(selectedOptions.filter((item) => item !== option));

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .doc(option)
        .update({
          votes: decrement,
        });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .update({ totalVotes: decrement });
    } else {
      setSelectedOptions((oldOptions) => [...oldOptions, option]);
      setTotalVotes(totalVotes + 1);

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .update({ totalVotes: increment });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .doc(option)
        .update({
          votes: increment,
        });
    }
  };

  useEffect(() => {
    const updateSelectedOptions = async () => {
      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .set({
          selectedOptions: selectedOptions,
        });
    };

    updateSelectedOptions();
  }, [selectedOptions]);

  return (
    <View style={styles.container}>
      <Card style={styles.cardPost}>
        <Card.Title title={text} />
        <Card.Content style={{ marginBottom: 10, marginLeft: 10 }}>
          {options.map((item) => {
            return (
              <>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <CheckBox
                    checked={selectedOptions.includes(item.option)}
                    onPress={() => Vote(item.option)}
                  />
                  <Paragraph style={{ marginTop: 17 }}>{item.option}</Paragraph>
                  <Paragraph
                    style={{ marginTop: 17, right: 0, position: "absolute" }}
                  >
                    {totalVotes !== 0
                      ? `${Math.floor((item.votes / totalVotes) * 100)} %`
                      : "0 %"}
                  </Paragraph>
                  <Chip
                    mode="flat"
                    style={{ right: 50, marginTop: 10, position: "absolute" }}
                  >
                    {item.votes} Votes
                  </Chip>
                </View>
                <ProgressBar
                  backgroundColor="red"
                  animated={true}
                  progress={Math.floor((item.votes / totalVotes) * 100)}
                />
              </>
            );
          })}
        </Card.Content>
      </Card>
    </View>
  );
};

export default UpdateMultipleSelectPollScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardPost: {
    marginTop: 30,
    width: screenWidth - 20,
  },
});

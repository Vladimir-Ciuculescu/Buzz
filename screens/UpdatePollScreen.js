import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Dimensions, View } from "react-native";
import { useRoute } from "@react-navigation/core";
import { Card, Paragraph, Button } from "react-native-paper";
import { CheckBox } from "react-native-elements";
import ProgressBar from "react-native-animated-progress";
import firebase from "firebase";
import { AsyncStorage } from "react-native";

const screenWidth = Dimensions.get("window").width;

const UpdatePollScreen = ({ navigation }) => {
  const route = useRoute();
  const postId = route.params.postId;

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userId, setUserId] = useState("");

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
        });

      const Options = [];

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

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .get()
        .then((result) => {
          setSelectedOption(result.data().selectedOption);
        });
    });
  }, []);

  const Vote = async (option) => {
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    //If the user has not voted at all;
    if (selectedOption === "") {
      setSelectedOption(option);
      setTotalVotes(totalVotes + 1);

      setOptions((oldOptions) => {
        return oldOptions.map((item) => {
          return item.option === option
            ? { option: item.option, votes: item.votes + 1 }
            : item;
        });
      });

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
        .update({ votes: increment });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .set({ selectedOption: option });

      setSelectedOption(option);
    }
    // If the user unchecks the selected option
    else if (selectedOption === option) {
      setTotalVotes(totalVotes - 1);
      setSelectedOption("");

      const modifiedOption = options.find((item) => item.option === option);

      setOptions((oldOptions) => {
        return oldOptions.map((item) => {
          return item === modifiedOption
            ? { option: item.option, votes: item.votes - 1 }
            : item;
        });
      });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .update({ totalVotes: decrement });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .doc(option)
        .update({ votes: decrement });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .set({ selectedOption: "" });
    } else {
      // If there is already a selected option and the user changes it .

      setOptions((oldOptions) => {
        return oldOptions.map((item) => {
          return item.option === selectedOption
            ? { option: item.option, votes: item.votes - 1 }
            : item.option === option
            ? { option: item.option, votes: item.votes + 1 }
            : item;
        });
      });

      setSelectedOption(option);

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .doc(selectedOption)
        .update({ votes: decrement });

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("options")
        .doc(option)
        .update({ votes: increment });

      setSelectedOption(option);

      await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .set({ selectedOption: option });
    }
  };

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
                    checked={item.option === selectedOption}
                    onPress={() => Vote(item.option)}
                  />
                  <Paragraph style={{ marginTop: 17 }}>{item.option}</Paragraph>
                  <Paragraph
                    style={{ marginTop: 17, right: 0, position: "absolute" }}
                  >
                    {Math.floor((item.votes / totalVotes) * 100)} %
                  </Paragraph>
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

export default UpdatePollScreen;

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

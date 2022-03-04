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
    //If
    if (option === selectedOption) {
      console.log("iesi acasa");
      return;
    }

    setSelectedOption(option);

    //Change the selected option
    await firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("users")
      .doc(userId)
      .set({ selectedOption: option });

    const increment = firebase.firestore.FieldValue.increment(1);
    //increment the total number of votes
    await firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .update({ totalVotes: increment });

    //increment the number of votes for the current selected option
    await firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("options")
      .doc(option)
      .update({
        votes: increment,
      });

    console.log(totalVotes);
  };

  return (
    <Card style={styles.cardPost}>
      <Card.Title title={text} />
      <Card.Content style={{ marginBottom: 10, marginLeft: -10 }}>
        {options.map((item) => {
          console.log(item.option);
          console.log(Math.floor((item.votes / totalVotes) * 100));
          return (
            <>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <CheckBox
                  checked={item.option === selectedOption}
                  onPress={() => Vote(item.option)}
                />
                <Paragraph style={{ marginTop: 20 }}>{item.option}</Paragraph>
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
      <Card.Actions>
        <Button>Change my vote</Button>
      </Card.Actions>
    </Card>
  );
};

export default UpdatePollScreen;

const styles = StyleSheet.create({
  cardPost: {
    marginBottom: 20,
    width: screenWidth - 30,
  },
});

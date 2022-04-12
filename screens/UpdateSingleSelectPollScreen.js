import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Text, StyleSheet, Dimensions, View, StatusBar } from "react-native";
import { useRoute } from "@react-navigation/core";
import { Card, Paragraph, Chip, Provider, List } from "react-native-paper";
import { CheckBox, Avatar } from "react-native-elements";
import ProgressBar from "react-native-animated-progress";
import firebase from "firebase";
import { AsyncStorage } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const UpdateSingleSelectPollScreen = ({ navigation }) => {
  const { mode } = useSelector((state) => state.theme);
  const refRBSheet = useRef();
  const route = useRoute();
  const postId = route.params.postId;

  const [text, setText] = useState("");
  const [options, setOptions] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userId, setUserId] = useState("");
  const [pollType, setPollType] = useState("");
  const [voters, setVoters] = useState([]);
  const [votersIds, setVotersIds] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Poll",
      headerStyle: {
        backgroundColor: mode === "light" ? "white" : "#282828",
      },
      headerTintColor: mode === "light" ? "black" : "white",
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

      const selectedOption = await firebase
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("users")
        .doc(userId)
        .get();

      if (selectedOption.exists) {
        setSelectedOption(selectedOption.data().selectedOption);
      } else {
        setSelectedOption("");
      }
    });
  }, []);

  const Vote = async (option) => {
    const increment = firebase.firestore.FieldValue.increment(1);
    const decrement = firebase.firestore.FieldValue.increment(-1);

    //If the type of the pall is single select;

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

  const getOptionVoters = async (option) => {
    const Ids = [];
    await firebase
      .firestore()
      .collection("posts")
      .doc(postId)
      .collection("users")
      .where("selectedOption", "==", option)
      .get()
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          Ids.push(doc.id);
        });
      });
    setVotersIds(Ids);

    refRBSheet.current.open();
  };

  useEffect(() => {
    const getVoters = async () => {
      await firebase
        .firestore()
        .collection("accounts")
        .where("userId", "in", votersIds)
        .get()
        .then((query) => {
          query.forEach((doc) => {
            setVoters((oldArray) => [
              ...oldArray,
              {
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                avatar: doc.data().avatar,
              },
            ]);
          });
        });
    };

    getVoters();
  }, [votersIds]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={mode === "light" ? "dark-content" : "light-content"}
        showHideTransition="fade"
        hidden={false}
      />
      <Provider>
        <View
          style={[
            styles.container,
            { backgroundColor: mode === "light" ? "transparent" : "#101010" },
          ]}
        >
          <Card
            style={[
              styles.cardPost,
              { backgroundColor: mode === "light" ? "white" : "#202020" },
            ]}
          >
            <Card.Title
              title={text}
              titleStyle={{ color: mode === "light" ? "black" : "white" }}
            />
            <Card.Content style={{ marginBottom: 10, marginLeft: 10 }}>
              {options.map((item) => {
                return (
                  <>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <CheckBox
                        checked={item.option === selectedOption}
                        onPress={() => Vote(item.option)}
                      />
                      <Paragraph
                        style={{
                          marginTop: 17,
                          color: mode === "light" ? "black" : "white",
                        }}
                      >
                        {item.option}
                      </Paragraph>
                      <Chip
                        disabled={item.votes === 0}
                        onPress={() => getOptionVoters(item.option)}
                        mode="flat"
                        style={{
                          right: 50,
                          marginTop: 10,
                          position: "absolute",
                          backgroundColor:
                            mode === "light" ? "#D0D0D0" : "#404040",
                        }}
                        selectedColor={mode === "light" ? "black" : "white"}
                      >
                        {item.votes} Votes
                      </Chip>
                      <Paragraph
                        style={{
                          marginTop: 17,
                          right: 0,
                          position: "absolute",
                          color: mode === "light" ? "black" : "white",
                        }}
                      >
                        {totalVotes !== 0
                          ? `${Math.floor((item.votes / totalVotes) * 100)} %`
                          : "0 %"}
                      </Paragraph>
                    </View>
                    <ProgressBar
                      backgroundColor="#61dafb"
                      animated={true}
                      progress={Math.floor((item.votes / totalVotes) * 100)}
                    />
                  </>
                );
              })}
            </Card.Content>
            <Card.Actions></Card.Actions>
          </Card>

          <RBSheet
            height={500}
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            onClose={() => setVoters([])}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
            }}
          >
            <View style={{ marginLeft: 20 }}>
              {voters.map((item) => (
                <List.Item
                  title={item.firstName + " " + item.lastName}
                  left={() => <Avatar rounded source={{ uri: item.avatar }} />}
                />
              ))}
            </View>
          </RBSheet>
        </View>
      </Provider>
    </>
  );
};

export default UpdateSingleSelectPollScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  cardPost: {
    marginTop: 30,
    width: screenWidth - 20,
  },
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      height: -3,
      width: 0,
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
  },
});

import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/core";
import firebase from "firebase";
import { Snackbar, Card, Avatar, Button, Chip } from "react-native-paper";
import moment from "moment";
import ImageModal from "react-native-image-modal";

const screenWidth = Dimensions.get("window").width;

const InformationalPostScreen = () => {
  const route = useRoute();

  const [avatar, setAvatar] = useState("");
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [timestamp, setTimestamp] = useState(0);

  const { postId, owner } = route.params;

  useEffect(() => {
    const getPost = async () => {
      const result = await firebase
        .firestore()
        .collection("posts")
        .where("postId", "==", postId)
        .get();

      result.forEach((doc) => {
        setAvatar(doc.data().avatar);
        setImage(doc.data().image);
        setText(doc.data().text);
        setTimestamp(doc.data().timestamp);
      });
    };

    getPost();
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.cardPost}>
        <Card.Content style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Avatar.Image
                size={40}
                source={{
                  uri: avatar,
                }}
              />
              <View style={{ flexDirection: "column", marginLeft: 10 }}>
                <Text>{owner}</Text>
                <Text style={styles.timestamp}>
                  {moment(timestamp).fromNow()}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{text}</Text>
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <ImageModal
                isTranslucent={true}
                resizeMode="contain"
                imageBackgroundColor="#000000"
                style={{
                  width: screenWidth - 10,
                  height: screenWidth - 20,
                }}
                source={{
                  uri: image,
                }}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default InformationalPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  cardPost: {
    height: screenWidth + 130,
    marginBottom: 20,
    width: screenWidth - 10,

    alignSelf: "center",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  name: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: "500",
    color: "#454D65",
    marginTop: 15,
    marginBottom: 10,
  },
});

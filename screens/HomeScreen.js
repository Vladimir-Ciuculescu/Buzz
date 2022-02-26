import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Touchable,
  AsyncStorage,
  FlatList,
  Image,
  Modal,
  ImageBackground,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  BottomNavigation,
  Snackbar,
  Card,
  Title,
  Paragraph,
  Avatar,
} from "react-native-paper";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import moment from "moment";
import ImageModal from "react-native-image-modal";

import firebase from "firebase";

const screenWidth = Dimensions.get("window").width;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.getUser();
    this.state = {
      imageWidth: 0,
      visible: true,
      user: "",
      loadingRefresh: false,
      posts: [],
      currentPost: null,
      togglePost: false,
    };
    this.getPosts();
  }

  getPosts = async () => {
    let result;
    await firebase
      .firestore()
      .collection("accounts")
      .get()
      .then((snap) => {
        snap.docs.forEach((doc) => {
          result = doc.data().userId;
        });
      });

    this.setState({ loadingRefresh: true });
    this.setState({ posts: [] });

    firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        var postAvatar, postOwner;
        querySnapshot.forEach(async (doc) => {
          let docId = doc.id;
          await firebase
            .firestore()
            .collection("accounts")
            .where("userId", "==", doc.data().uid)
            .get()
            .then((snapShot) => {
              snapShot.docs.forEach((doc) => {
                postAvatar = doc.data().avatar;
                postOwner = doc.data().lastName + " " + doc.data().firstName;
              });
            });

          let post;

          if (doc.data().type === "informational") {
            post = {
              image: doc.data().image,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              uid: doc.data().uid,
              avatar: postAvatar,
              postOwner: postOwner,
              type: doc.data().type,
            };
          } else {
            let options = [];
            firebase
              .firestore()
              .collection("posts")
              .doc(docId)
              .collection("options")
              .get()
              .then((snapShot) => {
                snapShot.forEach((doc) => {
                  options.push({
                    option: doc.data().option,
                    votes: doc.data().votes,
                  });
                });
              });
            post = {
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              options: options,
              uid: doc.data().uid,
              avatar: postAvatar,
              postOwner: postOwner,
              type: doc.data().type,
            };
          }
          this.setState({
            posts: [...this.state.posts, post],
          });
        });
      });

    // firebase
    //   .firestore()
    //   .collection("posts")
    //   .orderBy("timestamp", "desc")
    //   .get()
    //   .then((querySnapshot) => {
    //     let postAvatar, postOwner;
    //     querySnapshot.forEach(async (doc) => {
    //       console.log(doc.data().type);
    //       // await firebase
    //       //   .firestore()
    //       //   .collection("accounts")
    //       //   .where("userId", "==", doc.data().uid)
    //       //   .get()
    //       //   .then((snap) => {
    //       //     snap.docs.forEach((doc) => {
    //       //       postAvatar = doc.data().avatar;
    //       //       postOwner = doc.data().lastName + " " + doc.data().firstName;
    //       //     });
    //       //   });

    //       // let post = {
    //       //   image: doc.data().image,
    //       //   text: doc.data().text,
    //       //   timestamp: doc.data().timestamp,
    //       //   uid: doc.data().uid,
    //       //   avatar: postAvatar,
    //       //   postOwner,
    //       // };

    // this.setState({
    //   posts: [...this.state.posts, post],
    // });
    //     });
    //   });

    this.setState({ loadingRefresh: false });
  };

  getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    const query = firebase.firestore().collection("accounts").doc(user).get();
    const firstName = (await query).data().firstName;
    const lastName = (await query).data().lastName;
    const fullName = firstName + " " + lastName;
    this.setState({ user: fullName });
  };

  renderPost = (post) => {
    console.log(post.type);
    return (
      <Card style={styles.cardPost}>
        <Card.Content style={{ marginBottom: 10, marginLeft: -10 }}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Avatar.Image
                size={40}
                source={{
                  uri: post.avatar,
                }}
              />
              <View style={{ flexDirection: "column", marginLeft: 10 }}>
                <Text>{post.postOwner}</Text>
                <Text style={styles.timestamp}>
                  {moment(post.timestamp).fromNow()}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{post.text}</Text>
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
                  width: screenWidth - 20,
                  height: screenWidth - 20,
                }}
                source={{
                  uri: post.image,
                }}
              />
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={{ position: "absolute", bottom: 10 }}>
          <AntDesign
            name="hearto"
            size={24}
            color="#73788B"
            style={{ marginRight: 16 }}
          />
        </Card.Actions>
      </Card>
    );
  };

  render() {
    return (
      <View style={Style.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.feed}
          data={this.state.posts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          refreshing={this.state.loadingRefresh}
          onRefresh={this.getPosts}
        ></FlatList>
        <Snackbar
          visible={this.state.visible}
          action={{
            label: "Close",
            onPress: () => {
              this.setState({ visible: false });
            },
          }}
          style={{ backgroundColor: "#258e25" }}
          theme={{ colors: { accent: "white" } }}
          onDismiss={() => this.setState({ visible: false })}
          duration={2000}
        >
          Logged in as {this.state.user}
        </Snackbar>
      </View>
    );
  }
}
/*
<Snackbar
          visible={this.state.visible}
          action={{
            label: "Close",
            onPress: () => {
              this.setState({ visible: false });
            },
          }}
          style={{ backgroundColor: "#258e25" }}
          theme={{ colors: { accent: "white" } }}
          onDismiss={() => this.setState({ visible: false })}
          duration={2000}
        >
          Logged in as {this.state.user}
        </Snackbar>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFECF4",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  cardPost: {
    height: screenWidth + 130,
    marginBottom: 20,
    width: screenWidth - 30,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 15,
    marginLeft: 10,
    backgroundColor: "#ff0000",
  },
  name: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: "500",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,

    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    borderRadius: 5,
    marginVertical: 16,
    height: 150,
    width: undefined,
  },
});

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
    width: screenWidth + 10,
  },
  contentsContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  text: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: "300",
  },
});

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
} from "react-native";
import { BottomNavigation, Snackbar } from "react-native-paper";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import moment from "moment";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import firetore from "firebase/firestore";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.getUser();
    this.state = {
      visible: true,
      user: "",
      posts: [],
    };
    this.getPosts();
    console.log(this.state.posts);
  }

  getPosts = async () => {
    firebase
      .firestore()
      .collection("posts")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const post = {
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            uid: doc.data().uid,
          };
          this.setState({
            posts: [...this.state.posts, post],
          });
        });
      });
    //this.setState({ posts: posts });
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
    return (
      <View style={styles.feedItem}>
        <Image source={post.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{post.name}</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>

            <Feather name="more-horizontal" size={24} color="#73788B"></Feather>
          </View>
          <Text style={styles.post}>{post.text}</Text>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
            resizeMode="cover"
          ></Image>

          <View style={{ flexDirection: "row" }}>
            <AntDesign
              name="hearto"
              size={24}
              color="#73788B"
              style={{ marginRight: 16 }}
            />
            <Ionicons name="md-chatbox-outline" size={24} color="#73788B" />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buzz</Text>
        </View>

        <FlatList
          style={styles.feed}
          data={this.state.posts}
          renderItem={({ item }) => this.renderPost(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        ></FlatList>
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: "#ff0000",
  },
  name: {
    fontSize: 15,
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

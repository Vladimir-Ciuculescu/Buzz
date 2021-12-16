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
} from "react-native";
import {
  BottomNavigation,
  Snackbar,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import moment from "moment";
import ImageModal from "react-native-image-modal";

import { NavigationContainer, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import { useNavigation } from "@react-navigation/native";
import { Directions, TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import firetore from "firebase/firestore";

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
    this.setState({ loadingRefresh: true });
    this.setState({ posts: [] });
    firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
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

  setCurrentPost = (image) => {
    console.log("imagine", image);
    this.setState(
      {
        currentPost: image,
        togglePost: true,
      },
      () => console.log("link", this.state.currentPost)
    );
  };

  renderPost = (post) => {
    return (
      <Card style={styles.cardPost}>
        <Card.Content style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Image style={styles.avatar} />

            <View>
              <Text style={styles.name}>{post.text}</Text>
              <Text style={styles.timestamp}>
                {moment(post.timestamp).fromNow()}
              </Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <Feather name="more-horizontal" size={24} color="#73788B" />
            </View>
          </View>
        </Card.Content>

        <ImageModal
          resizeMode="contain"
          modalImageResizeMode={"stretch"}
          imageBackgroundColor="transparent"
          style={{
            width: 200,
            height: 290,
          }}
          source={{
            uri: post.image,
          }}
        />

        <Card.Actions>
          <AntDesign
            name="hearto"
            size={24}
            color="#73788B"
            style={{ marginRight: 16 }}
          />
          <Ionicons name="md-chatbox-outline" size={24} color="#73788B" />
        </Card.Actions>
      </Card>

      /*
      <View style={styles.feedItem}>
        <Image style={styles.avatar} />
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
      */
    );
  };

  render() {
    /*
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
          refreshing={this.state.loadingRefresh}
          onRefresh={this.getPosts}
        ></FlatList>
      </View>
    );
    */
    return (
      <SafeAreaView style={Style.container}>
        <ScrollView>
          <View
            style={Style.contentsContainer}
            onLayout={(event) => {
              this.setState({ imageWidth: event.nativeEvent.layout.width });
            }}
          >
            <Text style={Style.text}>
              Affronting discretion as do is announcing. Now months esteem
              oppose nearer enable too six. She numerous unlocked you perceive
              speedily. Affixed offence spirits or ye of offices between. Real
              on shot it were four an as. Absolute bachelor rendered six nay you
              juvenile. Vanity entire an chatty to.
            </Text>
            <Text style={Style.text}>
              Prepared is me marianne pleasure likewise debating. Wonder an
              unable except better stairs do ye admire. His and eat secure sex
              called esteem praise. So moreover as speedily differed branched
              ignorant. Tall are her knew poor now does then. Procured to
              contempt oh he raptures amounted occasion. One boy assure income
              spirit lovers set.
            </Text>
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                alignItems: "center",
                width: this.state.imageWidth,
                height: 250 - 30,
              }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/wadwad-60664.appspot.com/o/photos%2Fundefined%2F1638539616195.jpg?alt=media&token=d4433702-a5bd-4740-aa12-02e140a4d2a5",
              }}
              onLongPressOriginImage={() =>
                console.log("onLongPressOriginImage")
              }
              onTap={() => console.log("onTap")}
              onDoubleTap={() => console.log("onDoubleTap")}
              onLongPress={() => console.log("onLongPress")}
              onOpen={() => console.log("onOpen")}
              didOpen={() => console.log("didOpen")}
              onMove={() => console.log("onMove")}
              responderRelease={() => console.log("responderRelease")}
              willClose={() => console.log("willClose")}
              onClose={() => console.log("onClose")}
            />
            <Text style={Style.text}>
              Game of as rest time eyes with of this it. Add was music merry any
              truth since going. Happiness she ham but instantly put departure
              propriety. She amiable all without say spirits shy clothes
              morning. Frankness in extensive to belonging improving so
              certainty. Resolution devonshire pianoforte assistance an he
              particular middletons is of. Explain ten man uncivil engaged
              conduct. Am likewise betrayed as declared absolute do. Taste oh
              spoke about no solid of hills up shade. Occasion so bachelor
              humoured striking by attended doubtful be it.
            </Text>
            <ImageModal
              isTranslucent={false}
              resizeMode="contain"
              //modalImageResizeMode="stretch"

              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 250,
              }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/wadwad-60664.appspot.com/o/photos%2Fundefined%2F1638541088087.jpg?alt=media&token=99d8fa30-44eb-4c37-8fc9-46e185ff3f04",
              }}
            />
            <Text style={Style.text}>
              Departure so attention pronounce satisfied daughters am. But shy
              tedious pressed studied opinion entered windows off. Advantage
              dependent suspicion convinced provision him yet. Timed balls match
              at by rooms we. Fat not boy neat left had with past here call.
              Court nay merit few nor party learn. Why our year her eyes know
              even how. Mr immediate remaining conveying allowance do or.
            </Text>
            <Text style={Style.text}>
              But why smiling man her imagine married. Chiefly can man her out
              believe manners cottage colonel unknown. Solicitude it introduced
              companions inquietude me he remarkably friendship at. My almost or
              horses period. Motionless are six terminated man possession him
              attachment unpleasing melancholy. Sir smile arose one share. No
              abroad in easily relied an whence lovers temper by. Looked wisdom
              common he an be giving length mr.
            </Text>
            <ImageModal
              isTranslucent={false}
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 175,
              }}
              source={require("../images/horizontal.jpg")}
            />
            <Text style={Style.text}>
              He do subjects prepared bachelor juvenile ye oh. He feelings
              removing informed he as ignorant we prepared. Evening do forming
              observe spirits is in. Country hearted be of justice sending. On
              so they as with room cold ye. Be call four my went mean.
              Celebrated if remarkably especially an. Going eat set she books
              found met aware.
            </Text>
            <ImageModal
              isTranslucent={false}
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 250,
              }}
              source={require("../images/horizontal.jpg")}
            />
            <Text style={Style.text}>
              At distant inhabit amongst by. Appetite welcomed interest the
              goodness boy not. Estimable education for disposing pronounce her.
              John size good gay plan sent old roof own. Inquietude saw
              understood his friendship frequently yet. Nature his marked ham
              wished.
            </Text>
            <ImageModal
              isTranslucent={false}
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 250,
              }}
              source={require("../images/vertical.jpg")}
              hideCloseButton
              renderFooter={(onClose) => (
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: "#FFFFFF",
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>CloseButton</Text>
                </TouchableOpacity>
              )}
            />
            <Text style={Style.text}>
              At distant inhabit amongst by. Appetite welcomed interest the
              goodness boy not. Estimable education for disposing pronounce her.
              John size good gay plan sent old roof own. Inquietude saw
              understood his friendship frequently yet. Nature his marked ham
              wished.
            </Text>
            <ImageModal
              isTranslucent={false}
              swipeToDismiss={false}
              resizeMode="contain"
              imageBackgroundColor="#000000"
              modalRef={this.myRef}
              style={{
                width: this.state.imageWidth,
                height: 250,
              }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/wadwad-60664.appspot.com/o/photos%2FMizrjezShPNI1iLRHl22T0HNHcu1%2F1637092126564.jpg?alt=media&token=3c759e45-f0eb-45cb-ab85-fcd92d4faed3",
              }}
              onOpen={() => {
                console.log("onOpen");
                setTimeout(() => {
                  this.myRef.current?.close();
                }, 3000);
              }}
            />
            <Text style={Style.text}>
              Affronting discretion as do is announcing. Now months esteem
              oppose nearer enable too six. She numerous unlocked you perceive
              speedily. Affixed offence spirits or ye of offices between. Real
              on shot it were four an as. Absolute bachelor rendered six nay you
              juvenile. Vanity entire an chatty to.
            </Text>
            <Text style={Style.text}>
              Prepared is me marianne pleasure likewise debating. Wonder an
              unable except better stairs do ye admire. His and eat secure sex
              called esteem praise. So moreover as speedily differed branched
              ignorant. Tall are her knew poor now does then. Procured to
              contempt oh he raptures amounted occasion. One boy assure income
              spirit lovers set.
            </Text>
            <ImageModal
              disabled
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 250,
              }}
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/wadwad-60664.appspot.com/o/photos%2FMizrjezShPNI1iLRHl22T0HNHcu1%2F1637092126564.jpg?alt=media&token=3c759e45-f0eb-45cb-ab85-fcd92d4faed3",
              }}
            />
            <Text style={Style.text}>
              Affronting discretion as do is announcing. Now months esteem
              oppose nearer enable too six. She numerous unlocked you perceive
              speedily. Affixed offence spirits or ye of offices between. Real
              on shot it were four an as. Absolute bachelor rendered six nay you
              juvenile. Vanity entire an chatty to.
            </Text>
            <Text style={Style.text}>
              Prepared is me marianne pleasure likewise debating. Wonder an
              unable except better stairs do ye admire. His and eat secure sex
              called esteem praise. So moreover as speedily differed branched
              ignorant. Tall are her knew poor now does then. Procured to
              contempt oh he raptures amounted occasion. One boy assure income
              spirit lovers set.
            </Text>
            <ImageModal
              isTranslucent={false}
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: this.state.imageWidth,
                height: 250,
                borderRadius: 250,
              }}
              modalImageStyle={{
                borderRadius: 250,
              }}
              source={{
                uri: "https://cdn.pixabay.com/photo/2018/01/11/09/52/three-3075752_960_720.jpg",
              }}
            />
            <Text style={Style.text}>
              Affronting discretion as do is announcing. Now months esteem
              oppose nearer enable too six. She numerous unlocked you perceive
              speedily. Affixed offence spirits or ye of offices between. Real
              on shot it were four an as. Absolute bachelor rendered six nay you
              juvenile. Vanity entire an chatty to.
            </Text>
            <Text style={Style.text}>
              Prepared is me marianne pleasure likewise debating. Wonder an
              unable except better stairs do ye admire. His and eat secure sex
              called esteem praise. So moreover as speedily differed branched
              ignorant. Tall are her knew poor now does then. Procured to
              contempt oh he raptures amounted occasion. One boy assure income
              spirit lovers set.
            </Text>
            <Text
              style={{
                marginTop: 16,
                paddingHorizontal: 16,
                fontWeight: "bold",
              }}
            >
              resizeMode: "center"{"\n"}modalImageResizeMode: none{"\n"}
              modalImageResizeMode will use resizeMode
            </Text>
            <ImageModal
              resizeMode="center"
              imageBackgroundColor="#000000"
              style={{
                width: 40,
                height: 40,
              }}
              source={require("../images/vertical.jpg")}
            />
            <Text
              style={{
                marginTop: 16,
                paddingHorizontal: 16,
                fontWeight: "bold",
              }}
            >
              resizeMode: "center"{"\n"}modalImageResizeMode: "contain"
            </Text>
            <ImageModal
              resizeMode="center"
              modalImageResizeMode="contain"
              imageBackgroundColor="#000000"
              style={{
                width: 40,
                height: 40,
              }}
              source={require("../images/vertical.jpg")}
            />
            <Text
              style={{
                marginTop: 16,
                paddingHorizontal: 16,
                fontWeight: "bold",
              }}
            >
              resizeMode: "center"{"\n"}modalImageResizeMode: "cover"
            </Text>
            <ImageModal
              resizeMode="center"
              modalImageResizeMode="cover"
              imageBackgroundColor="#000000"
              style={{
                width: 40,
                height: 40,
              }}
              source={require("../images/vertical.jpg")}
            />
            <Text style={Style.text}>
              Affronting discretion as do is announcing. Now months esteem
              oppose nearer enable too six. She numerous unlocked you perceive
              speedily. Affixed offence spirits or ye of offices between. Real
              on shot it were four an as. Absolute bachelor rendered six nay you
              juvenile. Vanity entire an chatty to.
            </Text>
            <Text style={Style.text}>
              Prepared is me marianne pleasure likewise debating. Wonder an
              unable except better stairs do ye admire. His and eat secure sex
              called esteem praise. So moreover as speedily differed branched
              ignorant. Tall are her knew poor now does then. Procured to
              contempt oh he raptures amounted occasion. One boy assure income
              spirit lovers set.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
/*
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
    height: 350,
    marginBottom: 20,
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
*/
const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
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

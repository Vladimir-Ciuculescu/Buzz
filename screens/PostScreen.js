import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardList } from "react-native-card-list";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";

const PostTypes = [
  {
    id: 1,
    title: "Taking lunch",
    picture:
      "https://images.theconversation.com/files/410720/original/file-20210712-46002-1ku5one.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
    content: <Text>Order food</Text>,
  },
];

export default class PostScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="black"></Ionicons>
          </TouchableOpacity>
          <Text style={{}}>Add a new Post</Text>
          <TouchableOpacity>
            <Text style={{ fontWeight: "800" }}>Post</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>What kind of post do you want to make ?</Text>
          <Card style={styles.cardOption}>
            <CardImage
              source={{
                uri: "https://images.theconversation.com/files/410720/original/file-20210712-46002-1ku5one.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
              }}
              title="Order food"
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  cardOption: {
    paddingHorizontal: 20,
    height: 330,
    width: 330,
    alignSelf: "center",
  },
});

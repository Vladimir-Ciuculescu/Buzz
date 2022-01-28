import React from "react";
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useEffect, useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ChannelList } from "stream-chat-expo";
import { useState } from "react";
import { useChatContext } from "stream-chat-expo";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Searcher = ({ navigation }) => {
  const { client } = useChatContext();

  const [filters, setFilters] = useState({});
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      presentation: "modal",
    });
  });

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await client.queryChannels({});
      response.map((channel) => {
        console.log(channel.data.name);
      });
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    setFilters({ id: { $eq: input } });
  }, [input]);

  const searchChannel = (e) => {
    if (e === "") {
      setFilters({});
      return;
    }
    setInput(e);
  };

  const CustomPreview = (channel) => {
    return <Text>wad</Text>;
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TextInput
          placeholder="Looking for someone ?"
          style={styles.searchPersonInput}
          onChangeText={(e) => searchChannel(e)}
        />
        <TouchableOpacity
          style={{ alignSelf: "center", paddingLeft: 15, paddingTop: 25 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.results}>
        <ChannelList filters={filters} />
        <ChannelList Preview={CustomPreview} />
      </View>
    </View>
  );
};

export default Searcher;

const styles = StyleSheet.create({
  searchPersonInput: {
    marginTop: 20,
    height: 40,
    width: windowWidth - 70,
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 10,
    backgroundColor: "#DCDCDC",
    borderColor: "transparent",
    color: "black",
  },
  results: {
    marginTop: 30,
    width: "95%",
    marginHorizontal: 10,
    marginRight: 30,
    backgroundColor: "red",
    height: "85%",
  },
});

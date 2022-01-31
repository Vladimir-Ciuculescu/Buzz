import React from "react";
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import { useEffect, useLayoutEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { ChannelList } from "stream-chat-expo";
import { useState } from "react";
import { useChatContext } from "stream-chat-expo";

const windowWidth = Dimensions.get("window").width;

const Searcher = ({ navigation }) => {
  const { client } = useChatContext();
  const [filters, setFilters] = useState({});
  const [input, setInput] = useState("");
  const [allChanels, setAllChannels] = useState([]);
  const [channelsResponse, setChannelsResponse] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      presentation: "modal",
    });
  });

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await client.queryChannels();
      setAllChannels(
        response.map((item) => ({
          name: item.data.name.toString().toLowerCase(),
          id: item.data.id,
          last_sent: item.data.last_message_at,
        }))
      );
    };

    fetchChannels();
  }, [navigation]);

  useEffect(() => {
    setChannelsResponse(allChanels);
  }, [allChanels]);

  useEffect(() => {
    console.log(input);
    const filtered = allChanels.filter(
      (item) => item.name.includes(input) === true
    );

    setChannelsResponse(filtered);
  }, [input]);

  useEffect(() => {
    console.log("filtrate", channelsResponse);
  }, [channelsResponse]);

  const searchChannel = (e) => {
    const result = e.toLowerCase();
    setInput(result);
  };

  const enterChannel = async (id, name) => {
    const response = await client.queryChannels({ id: { $eq: id } });
    navigation.navigate("StreamChat", {
      channel: response[0],
      name: name,
    });
  };

  const renderChannel = ({ item }) => (
    <View style={{ paddingTop: 20 }}>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => enterChannel(item.id, item.name)}
      >
        <Feather
          style={{ paddingLeft: 20 }}
          name="hash"
          size={24}
          color="black"
        />

        <Text style={{ fontSize: 16, paddingLeft: 10 }}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TextInput
          autoCapitalize="none"
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
        {/* <ChannelList filters={filters} /> */}

        <FlatList
          data={channelsResponse}
          renderItem={renderChannel}
          keyExtractor={(item) => item.id}
        />
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
    height: "85%",
  },
});

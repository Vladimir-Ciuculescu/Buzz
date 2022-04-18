import React from "react";
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  View,
  Text,
  FlatList,
  StatusBar,
} from "react-native";
import { useEffect, useLayoutEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useChatContext } from "stream-chat-expo";
import { useSelector } from "react-redux";
const windowWidth = Dimensions.get("window").width;

const Searcher = ({ navigation, anticolor, color }) => {
  const { mode } = useSelector((state) => state.theme);
  const { client } = useChatContext();
  const [input, setInput] = useState("");
  const [allChanels, setAllChannels] = useState([]);
  const [channelsResponse, setChannelsResponse] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      headerTintColor: anticolor,
      headerStyle: { backgroundColor: color },
    });
  });

  useEffect(() => {
    const fetchChannels = async () => {
      StatusBar.setHidden(false);
      const response = await client.queryChannels({ member_count: { $ne: 2 } });
      console.log(response);
      setAllChannels(
        response.map((item) => ({
          name: item.data.name,
          id: item.data.id,
        }))
      );
    };

    fetchChannels();
  }, [navigation]);

  useEffect(() => {
    setChannelsResponse(allChanels);
  }, [allChanels]);

  useEffect(() => {
    const filtered = allChanels.filter((item) => item.name.includes(input));

    setChannelsResponse(filtered);
  }, [input]);

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
          color={mode === "dark" ? "white" : "black"}
        />

        <Text
          style={{
            fontSize: 16,
            paddingLeft: 10,
            color: mode === "dark" ? "white" : "black",
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: mode === "dark" ? "#101010" : "transparent",
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Looking for a channel ?"
          style={styles.searchPersonInput}
          onChangeText={(e) => searchChannel(e)}
        />
        <TouchableOpacity
          style={{ alignSelf: "center", paddingLeft: 15, paddingTop: 25 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign
            name="close"
            size={24}
            color={mode === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.results}>
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

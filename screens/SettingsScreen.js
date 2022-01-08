import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const SettingsScreen = (props) => {
  return (
    <View style={{ marginTop: 60, marginLeft: 30 }}>
      <TouchableOpacity onPress={() => console.log(props.navigation.goBack())}>
        <Text>awfwad</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

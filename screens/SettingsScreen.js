import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  AsyncStorage,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Drawer, Switch } from "react-native-paper";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(API_KEY);

const windowHeight = Dimensions.get("window").height;

const SettingsScreen = ({ navigation }) => {
  const [toggleSwitch, setToggleSwitch] = useState(false);

  const LogOut = () => {
    Alert.alert("Logout", "Are you sure you want to log out ?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          await client.disconnectUser();
          navigation.navigate("Login", { screen: "LoginScreen" });
        },
      },
    ]);
  };

  const onToggleSwitch = () => setToggleSwitch(!toggleSwitch);

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Section
        title="Preferences"
        style={{ marginTop: windowHeight - 400 }}
      >
        <View style={styles.preference}>
          <Text>Theme</Text>
          <Switch value={toggleSwitch} onValueChange={onToggleSwitch} />
        </View>
      </Drawer.Section>
      <Drawer.Section style={{ marginTop: 200 }}>
        <TouchableOpacity onPress={LogOut}>
          <Drawer.Item
            icon={() => (
              <Ionicons name="exit-outline" size={24} color="black" />
            )}
            label="Sign out"
          />
        </TouchableOpacity>
      </Drawer.Section>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  drawerSection: {
    marginTop: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderColor: "#f4f4f4",
    borderTopWidth: 1,
    marginTop: windowHeight - 100,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

import React, { useEffect, useState } from "react";
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
import { Drawer, Switch, DefaultTheme } from "react-native-paper";
import API_KEY from "../StreamCredentials";
import { StreamChat } from "stream-chat";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../redux/theme/theme";
import { useColorScheme } from "react-native";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";

const tema = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};

const client = StreamChat.getInstance(API_KEY);

const windowHeight = Dimensions.get("window").height;

const SettingsScreen = ({ navigation, color, anticolor }) => {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(mode);

  const [toggleSwitch, setToggleSwitch] = useState(
    mode === "light" ? true : false
  );

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

  useEffect(() => {
    if (toggleSwitch === true) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [toggleSwitch]);

  const onToggleSwitch = () => {
    console.log(theme);
    setToggleSwitch(!toggleSwitch);
    if (theme === "dark") {
      setTheme("light");
      dispatch(changeTheme("light"));
    } else {
      setTheme("dark");
      dispatch(changeTheme("dark"));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <Drawer.Section
        title="Preferences"
        style={{
          marginTop: windowHeight - 400,
          backgroundColor: color,
        }}
      >
        <View style={styles.preference}>
          <Text style={{ color: anticolor }}>Dark Theme</Text>
          <Switch value={toggleSwitch} onValueChange={onToggleSwitch} />
        </View>
      </Drawer.Section>
      <Drawer.Section
        style={{
          marginTop: 200,
          backgroundColor: color,
        }}
      >
        <TouchableOpacity style={{ backgroundColor: color }} onPress={LogOut}>
          <Drawer.Item
            style={{ backgroundColor: color, color: "red" }}
            icon={() => (
              <Ionicons name="exit-outline" size={24} color={anticolor} />
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

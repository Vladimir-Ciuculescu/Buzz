import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import firebase from "firebase";
import NotificationCard from "../components/NotificationCard";

import { Text, View, Button, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(mode);
  const { mode } = useSelector((state) => state.theme);

  return (
    <View>
      <NotificationCard />
      <NotificationCard />
    </View>
  );
};

export default NotificationScreen;

import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

export default class EditProfileModal extends React.Component {
  render() {
    return (
      <View>
        <Modal animationType="slide">
          <Text>Edit Profile</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Text>Exit</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

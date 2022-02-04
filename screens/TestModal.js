import React from "react";
import { Text, View } from "react-native";
import RNPoll from "react-native-poll";
import RNAnimated from "react-native-animated-component";

const choices = [
  { id: 1, choice: "Nike", votes: 13 },
  { id: 2, choice: "Adidas", votes: 1 },
  { id: 3, choice: "Puma", votes: 3 },
  { id: 4, choice: "Reebok", votes: 0 },
  { id: 5, choice: "Under Armour", votes: 13 },
];

const TestModal = () => {
  return (
    <RNPoll
      appearFrom="left"
      animationDuration={750}
      totalVotes={30}
      choices={choices}
      PollContainer={RNAnimated}
      PollItemContainer={RNAnimated}
      onChoicePress={(selectedChoice) =>
        console.log("SelectedChoice: ", selectedChoice)
      }
    />
  );
};

export default TestModal;

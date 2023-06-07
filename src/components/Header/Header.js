import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const StepperHeader = ({ step }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate("Transactions");
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={[styles.step, step >= 1 ? styles.activeStep : null]} />
        <View style={[styles.step, step >= 2 ? styles.activeStep : null]} />
        <View style={[styles.step, step >= 3 ? styles.activeStep : null]} />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="close-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 26,
    paddingHorizontal: 26,
    backgroundColor: "white",
  },
  stepContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  step: {
    flex: 1,
    height: 3,
    backgroundColor: "#E6EBF0",
    marginHorizontal: 4,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: "#7981FF",
  },
  backButton: {
    marginLeft: 16,
  },
});

export default StepperHeader;

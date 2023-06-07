import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { TransactionContext } from "../../../TransactionContext";

const ReviewBtn = () => {
  const { needsReviewTransactions } = useContext(TransactionContext);
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("NeedsReview");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <LinearGradient
        colors={["#C0CEFF", "#F4D9D0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {needsReviewTransactions.length} New{" "}
            <Text style={styles.buttonTextLight}>Transactions to Review </Text>
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#323A47" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 324,
    height: 39,
  },
  gradient: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: 324,
    height: 39,
    borderRadius: 6,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#323A47",
    fontSize: 14,
    fontFamily: "Manrope800",
    lineHeight: 19.12,
    textAlign: "center",
    justifyContent: "center",
  },
  buttonTextLight: {
    color: "#323A47",
    fontSize: 14,
    fontFamily: "Manrope500",
    lineHeight: 19.12,
    textAlign: "center",
    justifyContent: "center",
  },
});

export default ReviewBtn;

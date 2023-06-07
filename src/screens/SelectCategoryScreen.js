import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { TransactionContext } from "../../TransactionContext";
import { useNavigation } from "@react-navigation/native";

const SelectCategoryScreen = ({ categories }) => {
  const { updateTransaction, selectedTransaction } =
    useContext(TransactionContext);
  const navigation = useNavigation();
  const [, setSelectedCategory] = useState(null);
  const BASE_URL = "http://localhost:3000";
  const updateTransactionCategory = async (transactionId, categoryId) => {
    const csrfResponse = await fetch(`${BASE_URL}/csrf-token`);
    const data = await csrfResponse.json();
    const csrfToken = data.csrfToken;
    const updateResponse = await fetch(
      `${BASE_URL}/transactions/${transactionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          transaction: { category_id: categoryId },
        }),
      }
    );
    if (!updateResponse.ok) {
      throw new Error("Failed update category");
    }
    const updatedTransaction = await updateResponse.json();
    return updatedTransaction;
  };
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    updateTransactionCategory(selectedTransaction.id, category.id)
      .then((updatedTransaction) => {
        updateTransaction(updatedTransaction);
        navigation.navigate("ConfirmUpdateScreen");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {categories.slice(0, 3).map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => handleCategoryPress(category)}>
              <View
                style={[styles.circle, { backgroundColor: category.color }]}
              >
                <Text style={styles.categoryEmoji} key={category.id}>
                  {category.emoji}
                </Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.row}>
        {categories.slice(3, 6).map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => handleCategoryPress(category)}>
              <View
                style={[styles.circle, { backgroundColor: category.color }]}
              >
                <Text style={styles.categoryEmoji} key={category.id}>
                  {category.emoji}
                </Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};
const screenWidth = Dimensions.get("window").width;
const emojiSize = 0.15 * screenWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 36,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  categoryContainer: {
    alignItems: "center",
  },
  categoryEmoji: {
    fontSize: emojiSize,
    textAlign: "center",
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Manrope400",

    color: "#323A47",
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 90,
  },
  circle: {
    width: emojiSize + 30,
    height: emojiSize + 30,
    borderRadius: (emojiSize + 30) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
});

export default SelectCategoryScreen;

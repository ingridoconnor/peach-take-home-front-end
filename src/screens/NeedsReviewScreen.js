import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../../TransactionContext";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NeedsReviewScreen = () => {
  const {
    needsReviewTransactions,
    updateSelectedTransaction,
    updateNeedsReviewTransactions,
    selectedTransaction,
  } = useContext(TransactionContext);
  const navigation = useNavigation("NeedsReview");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setUpdating] = useState(false);
  const BASE_URL = "http://localhost:3000";
  const transaction = needsReviewTransactions[currentIndex];
  useEffect(() => {
    setCurrentIndex(needsReviewTransactions.length - 1);
  }, [needsReviewTransactions]);

  const handleCategorySelection = () => {
    const unreviewedTransaction = needsReviewTransactions.find(
      (transaction) => transaction.id === currentTransaction.id
    );
    updateSelectedTransaction(unreviewedTransaction);
    navigation.navigate("CategorySelection");
  };

  const handleMarkAsReviewed = async () => {
    setUpdating(true);
    try {
      const csrfResponse = await fetch(`${BASE_URL}/csrf-token`);
      const data = await csrfResponse.json();
      const csrfToken = data.csrfToken;

      const updateResponse = await fetch(
        `${BASE_URL}/transactions/${transaction.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            transaction: { reviewed: true },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to mark transaction as reviewed");
      }
      const needsReviewResponse = await fetch(
        `${BASE_URL}/transactions/needs_review`
      );
      const updatedNeedsReviewTransactions = await needsReviewResponse.json();
      const reviewedTransaction = await updateResponse.json();
      updateNeedsReviewTransactions(updatedNeedsReviewTransactions);

      if (needsReviewTransactions?.length > 1) {
        navigation.navigate("NeedsReview", {
          updatedTransaction: reviewedTransaction,
        });
      } else {
        navigation.navigate("Transactions");
      }
    } catch (error) {
      console.error("Error marking transaction as reviewed:", error);
    } finally {
      setUpdating(false);
    }
  };
  const currentTransaction = needsReviewTransactions[currentIndex];
  const transactionDate = new Date(currentTransaction?.transaction_date);
  const formattedDate = transactionDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const merchant = currentTransaction?.merchant?.name;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.transactionLight}>{formattedDate}</Text>
        <Text style={styles.transactionName}>{currentTransaction?.name}</Text>
        <Text style={styles.transactionLight}>{merchant}</Text>
        <Text style={styles.transactionAmount}>
          ${currentTransaction?.amount}
        </Text>
        {!currentTransaction?.reviewed && (
          <TouchableOpacity
            style={styles.categoryContainer}
            onPress={handleCategorySelection}
          >
            <View style={styles.category}>
              <Text>{currentTransaction?.category?.emoji}</Text>
            </View>
            <Text style={styles.transactionCategory}>
              {currentTransaction?.category?.name}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMarkAsReviewed(selectedTransaction?.id)}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 38,
    justifyContent: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#E6EBF0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "white",
    width: 328,
    height: 348,
    justifyContent: "center",
  },
  transactionName: {
    fontSize: 16,
    fontFamily: "Manrope600",
    textAlign: "center",
    lineHeight: 21.86,
    color: "#323A47",
  },
  transactionLight: {
    fontSize: 12,
    fontFamily: "Manrope400",
    lineHeight: 16.39,
    textAlign: "center",
    color: "#949CA8",
  },
  transactionAmount: {
    fontSize: 32,
    lineHeight: 43.71,
    fontFamily: "Manrope700",
    textAlign: "center",
    color: "#323A47",
    marginBottom: 8,
  },
  transactionCategory: {
    fontSize: 14,
    fontFamily: "Manrope700",
    lineHeight: 19.12,
    color: "#323A47",
    marginLeft: 8,
    textAlign: "center",
  },
  button: {
    width: 287,
    height: 39,
    borderRadius: 6,
    backgroundColor: "#323A47",
    justifyContent: "center",
  },
  category: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B6E4FB",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "Manrope700",
    textAlign: "center",
    lineHeight: 19,
    fontSize: 14,
  },
});

export default NeedsReviewScreen;

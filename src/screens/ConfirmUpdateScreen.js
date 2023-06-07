import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TransactionContext } from "../../TransactionContext";
import { useNavigation } from "@react-navigation/native";
import apiStore from "../../app/stores/apiStore";

const ConfirmUpdateScreen = () => {
  const navigation = useNavigation();
  const BASE_URL = "http://localhost:3000";
  const [, setUpdating] = useState(false);
  const [transactionCount, setTransactionCount] = useState();
  const {
    updatedTransaction,
    needsReviewTransactions,
    updateNeedsReviewTransactions,

    updateTransactions,
  } = useContext(TransactionContext);
  const transactionDate = new Date(updatedTransaction?.transaction_date);
  const merchant = updatedTransaction?.merchant?.name;
  const formattedDate = transactionDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    const unsubscribe = apiStore.listen(() => {
      const currentState = apiStore.getNeedsReviewTransactions();
      setTransactionCount(currentState.needsReviewTransactions.length);
    });

    return () => {
      unsubscribe();
    };
  }, [transactionCount]);

  useEffect(() => {
    if (needsReviewTransactions?.length > 1) {
      fetchUpdatedTransactions();
    }
  }, [needsReviewTransactions]);

  const fetchUpdatedTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/transactions`);
      const data = await response.json();
      updateTransactions(data);
    } catch (error) {
      console.error("Error fetching updated transactions:", error);
    }
  };

  const handleMarkAsReviewed = async () => {
    setUpdating(true);
    try {
      const csrfResponse = await fetch(`${BASE_URL}/csrf-token`);
      const data = await csrfResponse.json();
      const csrfToken = data.csrfToken;

      const updateResponse = await fetch(
        `${BASE_URL}/transactions/${updatedTransaction.id}`,
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.transactionLight}>{formattedDate}</Text>
        <Text style={styles.transactionName}>{updatedTransaction?.name}</Text>
        <Text style={styles.transactionLight}>{merchant}</Text>
        <Text style={styles.transactionAmount}>
          ${updatedTransaction?.amount}
        </Text>
        {!updatedTransaction?.reviewed && (
          <TouchableOpacity style={styles.categoryContainer}>
            <View
              style={[
                styles.category,
                {
                  backgroundColor: updatedTransaction?.category?.color,
                },
              ]}
            >
              <Text>{updatedTransaction?.category?.emoji}</Text>
            </View>
            <Text style={styles.transactionCategory}>
              {updatedTransaction?.category?.name}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMarkAsReviewed(updatedTransaction?.id)}
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
    padding: 16,
    backgroundColor: "white",
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

export default ConfirmUpdateScreen;

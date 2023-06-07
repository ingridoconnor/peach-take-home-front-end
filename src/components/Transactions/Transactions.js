import React from "react";
import { useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TransactionContext } from "../../../TransactionContext";

const Transactions = ({ transactions, unreviewedTransactions }) => {
  const {
    updateNeedsReviewTransactions,
    updatedTransactions,
    updateTransactions,
  } = useContext(TransactionContext);

  useEffect(() => {
    updateNeedsReviewTransactions(unreviewedTransactions);
  }, [unreviewedTransactions]);

  useEffect(() => {
    if (updatedTransactions) {
      updateTransactions(transactionList);
    }
  });

  const transactionList = updatedTransactions || transactions;
  const sortedTransactions = transactionList.sort(
    (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      {sortedTransactions?.map((transaction) => {
        const isMarked = !transaction.reviewed;
        const cardStyles = [styles.card, isMarked && styles.needsReviewCard];
        const formattedDate = new Date(
          transaction.transaction_date
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const transactionAmountStyle = [
          styles.transactionAmount,
          transaction.amount < 0 && styles.negativeAmount,
        ];
        const transactionAmount =
          transaction.amount < 0
            ? `+ $${Math.abs(transaction.amount)}`
            : `$${transaction.amount}`;
        return (
          <TouchableOpacity key={transaction.id} style={cardStyles}>
            <View style={styles.transactionInfo}>
              <View
                style={[
                  styles.emojiContainer,
                  { backgroundColor: transaction.category.color },
                ]}
              >
                <Text style={styles.emoji}>{transaction.category.emoji}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionCategory}>
                  {transaction.category.name}
                </Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text style={transactionAmountStyle}>{transactionAmount}</Text>
              <Text style={styles.transactionDate}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  amountContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 21.86,
    color: "#323A47",
    marginBottom: 16,
    fontFamily: "Manrope600",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    opacity: 0.7,
    backgroundColor: "white",
    width: 328,
    height: 67,
    paddingLeft: 30,
  },
  needsReviewCard: {
    borderLeftColor: "#7981FF",
    borderLeftWidth: 4,
  },

  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
  },
  transactionName: {
    fontSize: 14,
    fontFamily: "Manrope500",
    color: "#323A47",
    lineHeight: 19.12,
    textAlign: "left",
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: "Manrope400",
    color: "#888",
    lineHeight: 16,
    textAlign: "left",
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: "Manrope600",
    color: "#323A47",
    lineHeight: 19.12,
    textAlign: "right",
    paddingRight: 10,
  },
  negativeAmount: {
    color: "green",
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Manrope400",
    color: "#6C727C",
    lineHeight: 16,
    textAlign: "right",
    paddingRight: 10,
  },
  emojiContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  emoji: {
    fontSize: 14,
  },
  transactionDetails: {
    flex: 1,
    flexDirection: "column",
  },
});

export default Transactions;

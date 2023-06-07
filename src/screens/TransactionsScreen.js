import React from "react";
import { View, StyleSheet } from "react-native";

import Transactions from "../components/Transactions/Transactions";
import ReviewBtn from "../components/Transactions/RecentTransactionsReviewBtn";

import PieChart from "../components/PieChart/PieChart";

const TransactionsScreen = ({
  categories,
  transactions,
  unreviewedTransactions,
}) => {
  return (
    <View style={styles.container}>
      <PieChart categories={categories} transactions={transactions} />
      <ReviewBtn
        title={unreviewedTransactions?.length}
        unreviewedTransactions={unreviewedTransactions}
        transactions={transactions}
      />
      <Transactions
        transactions={transactions}
        unreviewedTransactions={unreviewedTransactions}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default TransactionsScreen;

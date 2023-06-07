import AsyncStorage from "@react-native-async-storage/async-storage";
import Reflux from "reflux";
import transactionsActions from "../actions/transactionsActions";

const apiDefaultData = {
  transactions: [],
  needsReviewTransactions: [],
};

const transactionsStore = Reflux.createStore({
  init() {
    AsyncStorage.getItem("apiData", (err, data) => {
      if (!err) {
        let savedAppState = JSON.parse(data);
        this.apiData = Object.assign({}, savedAppState || apiDefaultData);
        this.listenTo(
          transactionsActions.getTransactions.completed,
          this.getTransactions
        );
        this.listenTo(
          transactionsActions.getNeedsReviewTransactions.completed,
          this.getNeedsReviewTransactions
        );
        this.listenTo(
          transactionsActions.updateNeedsReviewTransaction,
          this.updateNeedsReviewTransaction
        );
      }
    });
  },
  getTransactions(data) {
    return new Promise((resolve, reject) => {
      this.apiData.transactions = data.data;
      this.saveCurrentState();
      this.trigger({ target: "UPDATE_TRANSACTIONS" });
      resolve();
    }).catch((error) => {
      reject(error);
    });
  },
  getNeedsReviewTransactions(data) {
    return new Promise((resolve, reject) => {
      this.apiData.needsReviewTransactions = data.data;
      this.saveCurrentState();
      this.trigger({ target: "UPDATE_NEEDS_REVIEW_TRANSACTIONS" });
      resolve();
    }).catch((error) => {
      reject(error);
    });
  },
  markTransactionAsReviewed(transactionId) {
    return new Promise((resolve, reject) => {
      const transaction = this.apiData.transactions.find(
        (t) => t.id === transactionId
      );
      if (transaction) {
        transaction.reviewed = true;
        this.saveCurrentState();
        this.trigger({ target: "MARK_TRANSACTION_REVIEWED" });
      }
    }).catch((error) => {
      reject(error);
    });
  },
  updateNeedsReviewTransaction(updatedTransaction) {
    const { needsReviewTransactions } = this.apiData;
    const index = needsReviewTransactions.findIndex(
      (t) => t.id === updatedTransaction.id
    );

    if (index !== -1) {
      needsReviewTransactions[index] = updatedTransaction;
      this.saveCurrentState();
      this.trigger({ target: "UPDATE_NEEDS_REVIEW_TRANSACTIONS" });
    }
  },
  getCurrentState() {
    return this.apiData;
  },

  saveCurrentState() {
    AsyncStorage.setItem("apiData", JSON.stringify(this.apiData));
  },
});

export default transactionsStore;

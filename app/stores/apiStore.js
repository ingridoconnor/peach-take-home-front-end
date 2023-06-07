import AsyncStorage from "@react-native-async-storage/async-storage";
import Reflux from "reflux";
import apiActions from "../actions/apiActions";

const apiDefaultData = {
  categories: {},
  merchants: {},
  transactions: {},
  needsReviewTransactions: {},
};

const apiStore = Reflux.createStore({
  init() {
    AsyncStorage.getItem("apiData", (err, data) => {
      if (!err) {
        let savedAppState = JSON.parse(data);
        this.apiData = Object.assign({}, savedAppState || apiDefaultData);
        this.listenTo(apiActions.getCategories.completed, this.getCategories);
        this.listenTo(apiActions.getMerchants.completed, this.getMerchants);
        this.listenTo(
          apiActions.getTransactions.completed,
          this.getTransactions
        );
        this.listenTo(
          apiActions.getNeedsReviewTransactions.completed,
          this.getNeedsReviewTransactions
        );
        this.listenTo(
          apiActions.updateNeedsReviewTransaction,
          this.updateNeedsReviewTransaction
        );
      }
    });
  },

  getCategories(data) {
    this.apiData.categories = data.data;

    this.saveCurrentState();
    this.trigger({ target: "UPDATE_CATEGORIES" });
  },

  getMerchants(data) {
    this.apiData.merchants = data.data;

    this.saveCurrentState();
    this.trigger({ target: "UPDATE_MERCHANTS" });
  },
  getTransactions(data) {
    this.apiData.transactions = data.data;
    this.saveCurrentState();
    this.trigger({ target: "UPDATE_TRANSACTIONS" });
  },
  getNeedsReviewTransactions(data) {
    this.apiData.needsReviewTransactions = data.data;
    this.saveCurrentState();
    this.trigger({ target: "UPDATE_NEEDS_REVIEW_TRANSACTIONS" });
  },
  markTransactionAsReviewed(transactionId) {
    const transaction = this.apiData.transactions.find(
      (t) => t.id === transactionId
    );
    if (transaction) {
      transaction.reviewed = true;
      this.saveCurrentState();
      this.trigger({ target: "MARK_TRANSACTION_REVIEWED" });
    }
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

export default apiStore;

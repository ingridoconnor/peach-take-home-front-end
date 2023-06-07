import Reflux from "reflux";

// TODO: Set your Backend URL here!
const BASE_URL = "http://localhost:3000";

const apiActions = Reflux.createActions({
  getCategories: { asyncResult: true },
  getMerchants: { asyncResult: true },
  getTransactions: { asyncResult: true },
  getNeedsReviewTransactions: { asyncResult: true },
  markTransactionAsReviewed: {},
  updateTransactionCategory: {},
  updateNeedsReviewTransaction: {},
});

apiActions.getCategories.listen(() => {
  const reqUrl = `${BASE_URL}/categories`;

  fetch(reqUrl)
    .then((data) => data.json())
    .then((data) => {
      apiActions.getCategories.completed({
        data: data,
      });
      console.log("apiActions.getCategories - success!");
    })
    .catch((error) => {
      apiActions.getCategories.completed({
        data: error,
        loadFail: true,
      });
    });
});

apiActions.getMerchants.listen(() => {
  const reqUrl = `${BASE_URL}/merchants`;
  fetch(reqUrl)
    .then((data) => data.json())
    .then((data) => {
      apiActions.getMerchants.completed({
        data: data,
      });
      console.log("apiActions.getMerchants - success!");
    })
    .catch((error) => {
      apiActions.getMerchants.completed({
        data: error,
        loadFail: true,
      });
    });
});
apiActions.getTransactions.listen(() => {
  const reqUrl = `${BASE_URL}/transactions`;
  fetch(reqUrl)
    .then((data) => data.json())
    .then((data) => {
      apiActions.getTransactions.completed({
        data: data,
      });
      console.log("apiActions.getTransactions - success!");
    })
    .catch((error) => {
      apiActions.getTransactions.completed({
        data: error,
        loadFail: true,
      });
    });
});
apiActions.markTransactionAsReviewed.listen(function (
  transactionId,
  data,
  callback
) {
  const url = `${BASE_URL}/transactions/${transactionId}`;
  const authenticityToken = document.getElementsByName("csrf-token")[0].content;

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": authenticityToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to mark transaction as reviewed");
      }
      return response.json();
    })
    .then((updatedTransaction) => {
      callback(null, updatedTransaction);
      apiActions.updateNeedsReviewTransaction(updatedTransaction);
    })
    .catch((error) => {
      callback(error);
    });
});

apiActions.getNeedsReviewTransactions.listen(() => {
  const reqUrl = `${BASE_URL}/transactions/needs_review`;
  fetch(reqUrl)
    .then((data) => data.json())
    .then((data) => {
      apiActions.getNeedsReviewTransactions.completed({
        data: data,
      });
      console.log("apiActions.getNeedsReviewTransactions - success!");
    })
    .catch((error) => {
      apiActions.getNeedsReviewTransactions.completed({
        data: error,
        loadFail: true,
      });
    });
});

apiActions.updateTransactionCategory.listen(function (
  transactionId,
  category,
  callback
) {
  const url = `${BASE_URL}/transactions/${transactionId}`;
  const authenticityToken = document.getElementsByName("csrf-token")[0].content;

  const data = {
    category: category,
  };

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": authenticityToken,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update transaction category");
      }
      return response.json();
    })
    .then((updatedTransaction) => {
      callback(null, updatedTransaction);
    })
    .catch((error) => {
      callback(error);
    });
});

export default apiActions;

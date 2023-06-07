import React, { createContext, useState } from "react";

export const TransactionContext = createContext();

const TransactionProvider = ({ children }) => {
  const [updatedTransactions, setUpdatedTransactions] = useState();
  const [updatedTransaction, setUpdatedTransaction] = useState(null);
  const [needsReviewTransactions, setNeedsReviewTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState();

  const updateTransaction = (transaction) => {
    setUpdatedTransaction(transaction);
  };

  const updateNeedsReviewTransactions = (transactions) => {
    setNeedsReviewTransactions(transactions);
  };
  const updateSelectedTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };
  const updateTransactions = (transactions) => {
    setUpdatedTransactions(transactions);
  };

  return (
    <TransactionContext.Provider
      value={{
        updatedTransaction,
        selectedTransaction,
        needsReviewTransactions,
        updatedTransactions,
        updateTransaction,
        updateNeedsReviewTransactions,
        updateSelectedTransaction,
        updateTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionProvider };

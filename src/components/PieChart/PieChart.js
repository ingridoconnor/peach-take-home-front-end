/* eslint-disable no-prototype-builtins */
import React, { useEffect, useRef, useContext } from "react";
import { TransactionContext } from "../../../TransactionContext";
import { StyleSheet, View, Text } from "react-native";
import { VictoryClipContainer, VictoryPie } from "victory-native";

const PieChart = ({ transactions }) => {
  const cardRef = useRef(null);
  const { updatedTransactions } = useContext(TransactionContext);
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.setNativeProps({ height: 236 });
    }
  }, []);
  const transactionList = updatedTransactions
    ? updatedTransactions
    : transactions;
  const filteredTransactions = transactionList?.filter(
    (transaction) => transaction.amount >= 0
  );

  const { categoryCounts, categoryTotals } = filteredTransactions.reduce(
    (result, transaction) => {
      const { category, amount } = transaction;
      const categoryName = category.name;

      if (category.name !== "Income") {
        if (result.categoryCounts[categoryName]) {
          result.categoryCounts[categoryName] += parseFloat(amount);
        } else {
          result.categoryCounts[categoryName] = parseFloat(amount);
        }
        if (result.categoryTotals[categoryName]) {
          result.categoryTotals[categoryName] += parseFloat(amount);
        } else {
          result.categoryTotals[categoryName] = parseFloat(amount);
        }
      }

      return result;
    },
    { categoryCounts: {}, categoryTotals: {} }
  );

  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const topCategories = sortedCategories.slice(0, 3);
  const otherCategories = sortedCategories.slice(3);
  const otherCategoriesData = otherCategories.reduce(
    (result, [category, amount]) => {
      if (category !== "Income") {
        result[category] = {
          color: "grey",
          emoji: categoryCounts[category].emoji,
          amount: amount.toFixed(2),
        };
      }
      return result;
    },
    {}
  );

  const totalSpending = Object.values(categoryTotals).reduce(
    (total, amount) => total + parseFloat(amount),
    0
  );

  const topCategoryData = topCategories.reduce((result, [category, amount]) => {
    const transaction = filteredTransactions.find(
      (transaction) => transaction.category.name === category
    );
    if (transaction) {
      result[category] = {
        color: transaction.category.color,
        emoji: transaction.category.emoji,
        amount: amount.toFixed(2),
      };
    }
    return result;
  }, {});

  const calculateTotalSpending = () => {
    const spendingAmounts = Object.values(categoryTotals).filter(
      (amount) => amount > 0
    );
    const totalSpending = spendingAmounts.reduce(
      (total, amount) => total + parseFloat(amount),
      0
    );
    return totalSpending.toFixed(2);
  };

  const renderCategory = (category, data, backgroundColor) => (
    <View key={category} style={styles.categoryName}>
      <View style={[styles.categoryTab, { backgroundColor }]}></View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryInfoText}>
          {data.emoji} {category}
        </Text>
        <Text style={styles.categoryAmount}>${data.amount}</Text>
      </View>
    </View>
  );

  const renderTopCategories = () =>
    Object.entries(topCategoryData).map(([category, data]) =>
      renderCategory(category, data, data.color)
    );

  const renderOtherCategories = () => {
    const otherCategoriesTotal = Object.values(otherCategoriesData).reduce(
      (total, data) => total + parseFloat(data.amount),
      0
    );
    const otherCategoriesPercentage = (
      (otherCategoriesTotal / totalSpending) *
      100
    ).toFixed(2);
    const otherCategories = {
      Others: {
        color: "grey",
        emoji: otherCategoriesData.Others?.emoji || "",
        amount: otherCategoriesTotal.toFixed(2),
        percentage: otherCategoriesPercentage,
      },
    };

    return Object.entries(otherCategories).map(([category, data]) =>
      renderCategory(category, data, "grey")
    );
  };

  const renderPieChart = () => {
    const dataWithoutOthers = Object.keys(categoryTotals)
      .filter(
        (category) =>
          category !== "Others" && !otherCategoriesData.hasOwnProperty(category)
      )
      .map((category) => {
        const amount = categoryTotals[category];
        const percentage = ((parseFloat(amount) / totalSpending) * 100).toFixed(
          2
        );
        const { color } =
          topCategoryData[category] || otherCategoriesData[category];
        return {
          x: category,
          y: Math.round(percentage),
          label: `${Math.round(percentage)}%`,
          color,
        };
      });

    const otherCategoriesTotal = Object.values(otherCategoriesData).reduce(
      (total, data) => total + parseFloat(data.amount),
      0
    );
    const otherCategoriesPercentage = (
      (otherCategoriesTotal / totalSpending) *
      100
    ).toFixed(2);

    const othersData = {
      x: "Others",
      y: Math.round(otherCategoriesPercentage),
      label: `${Math.round(otherCategoriesPercentage)}%`,
      color: "grey",
    };

    const data = [...dataWithoutOthers, othersData];

    return (
      <View style={styles.pieContainer}>
        <VictoryClipContainer clipHeight={20}>
          <VictoryPie
            width={180}
            height={500}
            innerRadius={50}
            style={{
              data: { fill: (d) => d.datum.color },
            }}
            data={data}
            labels={({ datum }) => datum.label}
          />
        </VictoryClipContainer>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.topSpendingText}>Top Spending Categories</Text>
        <View style={styles.categoriesContainer}>
          {renderTopCategories()}
          {renderOtherCategories()}
        </View>
        {renderPieChart()}
        <Text style={styles.spendingContainer}>
          <Text style={styles.totalText}>Total:</Text>{" "}
          <Text style={styles.amountText}>+${calculateTotalSpending()}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E6EBF0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "white",
    width: 324,
    height: 236,
  },
  pieContainer: {
    position: "absolute",
    left: 140,
    top: -140,
    zIndex: 1,
  },
  categoriesContainer: {
    padding: 5,
    position: "absolute",
    left: 12,
    top: 25,
    zIndex: 1,
  },
  spendingContainer: {
    padding: 5,
    position: "absolute",
    left: 170,
    top: 200,
    zIndex: 1,
  },

  categoryName: {
    flexDirection: "row",
    paddingBottom: 8,
    paddingRight: 8,
    paddingTop: 8,
  },
  categoryTab: {
    width: 4,
    height: 30,
    borderRadius: 2,
  },
  categoryInfo: {
    flexDirection: "column",
    paddingLeft: 10,
  },
  categoryInfoText: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 11,
    lineHeight: 13.66,
    fontFamily: "Manrope500",
    color: "#6C727C",
  },
  categoryAmount: {
    fontFamily: "Manrope700",
    fontSize: 14,
    lineHeight: 19.12,
    color: "#323A47",
  },
  topSpendingText: {
    fontSize: 12,
    fontFamily: "Manrope600",
    color: "#949CA8",
  },
  totalText: {
    fontFamily: "Manrope500",
    fontSize: 12,
    color: "#6C727C",
    lineHeight: 17,
  },
  amountText: {
    fontFamily: "Manrope700",
    fontSize: 14,
    color: "#323A47",
    lineHeight: 19,
  },
});

export default PieChart;

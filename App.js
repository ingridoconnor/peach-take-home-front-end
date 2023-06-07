import React, { useEffect, useState } from "react";
import apiActions from "./app/actions/apiActions";
import apiStore from "./app/stores/apiStore";
import StepperHeader from "./src/components/Header/Header";
import CategorySelectionHeader from "./src/components/Header/CategorySelectionHeader";
import NeedsReviewScreen from "./src/screens/NeedsReviewScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SelectCategoryScreen from "./src/screens/SelectCategoryScreen";
import ConfirmUpdateScreen from "./src/screens/ConfirmUpdateScreen";
import { TransactionProvider } from "./TransactionContext";
import { useFonts } from "expo-font";
import * as Font from "expo-font";
import TransactionsScreen from "./src/screens/TransactionsScreen";

const Stack = createStackNavigator();

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [unreviewedTransactions, setUnreviewedTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Manrope400: require("./assets/fonts/Manrope/static/Manrope-Regular.ttf"),
        Manrope500: require("./assets/fonts/Manrope/static/Manrope-Medium.ttf"),
        Manrope600: require("./assets/fonts/Manrope/static/Manrope-SemiBold.ttf"),
        Manrope700: require("./assets/fonts/Manrope/static/Manrope-Bold.ttf"),
        Manrope800: require("./assets/fonts/Manrope/static/Manrope-ExtraBold.ttf"),
      });
    }

    loadFonts();
  }, []);

  useEffect(() => {
    const unsubscribe = apiStore.listen(onStateChange);

    apiActions.getCategories();
    apiActions.getMerchants();
    apiActions.getTransactions();
    apiActions.getNeedsReviewTransactions();

    return () => unsubscribe;
  }, []);

  const onStateChange = (data) => {
    switch (data.target) {
      case "UPDATE_CATEGORIES":
        updateCategories();
        break;
      case "UPDATE_MERCHANTS":
        updateMerchants();
        break;
      case "UPDATE_TRANSACTIONS":
        updateTransactions();
        break;
      case "UPDATE_NEEDS_REVIEW_TRANSACTIONS":
        updateNeedsReviewTransactions();
        break;
      default:
        return;
    }
  };

  const updateCategories = () => {
    const currentState = apiStore.getCurrentState();
    setCategories(currentState.categories);
    console.log(
      "Received Categories: " + JSON.stringify(currentState.categories)
    );
  };

  const updateMerchants = () => {
    const currentState = apiStore.getCurrentState();
    console.log(
      "Received Merchants: " + JSON.stringify(currentState.merchants)
    );
  };

  const updateTransactions = () => {
    const currentState = apiStore.getCurrentState();
    setTransactions(currentState.transactions);
    console.log(
      "Received Transactions: " + JSON.stringify(currentState.transactions)
    );
  };

  const updateNeedsReviewTransactions = () => {
    const currentState = apiStore.getCurrentState();
    setUnreviewedTransactions(currentState.needsReviewTransactions);
    console.log(
      "Needs Review Transactions: " +
        JSON.stringify(currentState.needsReviewTransactions)
    );
  };

  let [fontsLoaded] = useFonts({
    Manrope400: require("./assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    Manrope500: require("./assets/fonts/Manrope/static/Manrope-Medium.ttf"),
    Manrope700: require("./assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    Manrope600: require("./assets/fonts/Manrope/static/Manrope-SemiBold.ttf"),
    Manrope800: require("./assets/fonts/Manrope/static/Manrope-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TransactionProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Transactions"
            options={{
              headerTitle: "Home",
              headerTitleAlign: "left",
              headerTitleStyle: {
                color: "#323A47",
                fontFamily: "Manrope800",
                lineHeight: 30,
                fontSize: 22,
              },
            }}
          >
            {() => (
              <TransactionsScreen
                categories={categories}
                transactions={transactions}
                unreviewedTransactions={unreviewedTransactions}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="NeedsReview"
            options={{
              header: () => <StepperHeader step={1} />,
            }}
          >
            {(props) => (
              <NeedsReviewScreen
                unreviewedTransactions={unreviewedTransactions}
                {...props}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="CategorySelection"
            options={({ navigation }) => ({
              header: () => <CategorySelectionHeader navigation={navigation} />,
            })}
          >
            {() => <SelectCategoryScreen categories={categories} />}
          </Stack.Screen>
          <Stack.Screen
            name="ConfirmUpdateScreen"
            options={{
              header: () => <StepperHeader step={3} />,
            }}
          >
            {() => (
              <ConfirmUpdateScreen
                unreviewedTransactions={unreviewedTransactions}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../store/expensesSlice";
import { useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { getDateMinusDays } from "../util/date";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { clearError } from "../store/expensesSlice";

function RecentExpenses() {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const loading = useSelector((state) => state.expenses.loading);
  const error = useSelector((state) => state.expenses.error);

  useEffect(() => {
    async function loadExpenses() {
      try {
        await dispatch(fetchExpenses()).unwrap();
      } catch (error) {
        console.log("Error fetching expenses:", error);
      }
    }
    loadExpenses();
  }, [dispatch]);

  useEffect(() => {
    console.log("Expenses from Redux: ", expenses);
  }, [expenses]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <ErrorOverlay message={error} onConfirm={() => dispatch(clearError())} />
    );
  }

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    const expenseDate = new Date(expense.date);
    return expenseDate >= date7DaysAgo && expenseDate <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;

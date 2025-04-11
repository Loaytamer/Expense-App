import { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  deleteExpenseThunk,
  storeExpenseThunk,
  updateExpenseThunk,
} from "../store/expensesSlice";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.expenses.loading);
  const error = useSelector((state) => state.expenses.error);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = useSelector((state) =>
    state.expenses.items.find((expense) => expense.id === editedExpenseId)
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    try {
      if (isEditing) {
        const result = await dispatch(
          updateExpenseThunk({
            id: editedExpenseId,
            expenseData: {
              description: expenseData.description,
              amount: expenseData.amount,
              date: expenseData.date,
            },
          })
        ).unwrap();
        // Only navigate if successful
        navigation.goBack();
      } else {
        await dispatch(storeExpenseThunk(expenseData)).unwrap();
        navigation.goBack();
      }
    } catch (error) {
      // Don't navigate on error - let the error overlay show
      // The error will be in the Redux store
    }
  }

  async function deleteExpenseHandler() {
    try {
      await dispatch(deleteExpenseThunk(editedExpenseId)).unwrap();
      navigation.goBack();
    } catch (error) {
      // Don't navigate on error - let the error overlay show
    }
  }

  function handleErrorConfirm() {
    dispatch(clearError());
  }

  if (error) {
    return <ErrorOverlay message={error} onConfirm={handleErrorConfirm} />;
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onCancel={cancelHandler}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            size={36}
            color={GlobalStyles.colors.error500}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});

import { Text } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useDispatch, useSelector } from "react-redux";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { clearError } from "../store/expensesSlice";

function AllExpenses() {
  
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items); 
  const loading = useSelector((state) => state.expenses.loading); 
  const error = useSelector((state) => state.expenses.error); 
  if (loading) {
    return <LoadingOverlay/>;
  }

  if (error) {
    return <ErrorOverlay message={error} onConfirm={() => dispatch(clearError())} />;
  }

  return (
    <ExpensesOutput
      expenses={expenses}
      expensesPeriod="Total"
      fallbackText="No registered expenses found."
    />
  );
}

export default AllExpenses;

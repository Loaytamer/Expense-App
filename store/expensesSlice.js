import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExpenses as fetchExpensesAPI,
  storeExpense as storeExpenseAPI,
  updateExpense as updateExpenseAPI,
  deleteExpense as deleteExpenseAPI,
} from "../util/http";

// Thunks
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { rejectWithValue }) => {
    try {
      const expenses = await fetchExpensesAPI();
      return expenses.map((e) => ({
        ...e,
        date: new Date(e.date).toISOString(),
      }));
    } catch (error) {
      return rejectWithValue(error.message || "Could not fetch expenses.");
    }
  }
);

export const storeExpenseThunk = createAsyncThunk(
  "expenses/storeExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
      const storedExpense = await storeExpenseAPI(expenseData);
      return {
        ...storedExpense,
        date: storedExpense.date.toISOString(), // serialize date
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to store expense.");
    }
  }
);

export const updateExpenseThunk = createAsyncThunk(
  "expenses/updateExpenseThunk",
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const updatedExpense = await updateExpenseAPI(id, expenseData);
      if (!updatedExpense) {
        return rejectWithValue("Failed to update expense");
      }
      return updatedExpense;
    } catch (error) {
      console.log("Update Thunk Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExpenseThunk = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      await deleteExpenseAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete expense.");
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addExpense: (state, action) => {
      const newExpense = {
        ...action.payload,
        date: action.payload.date.toISOString(), // make sure it's a string
      };
      state.items.unshift(newExpense);
    },
    deleteExpense: (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    updateExpense: (state, action) => {
      const { id, description, amount, date } = action.payload;
      const existing = state.items.find((e) => e.id === id);
      if (existing) {
        existing.description = description;
        existing.amount = amount;
        existing.date = date.toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Setting loading explicitly
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Store Expense
      .addCase(storeExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(storeExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Expense
      .addCase(updateExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedExpenseIndex = state.items.findIndex(
          (expense) => expense.id === action.payload.id
        );
        if (updatedExpenseIndex !== -1) {
          state.items[updatedExpenseIndex] = action.payload;
        }
      })
      .addCase(updateExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update expense";
        console.log("Redux: Setting error state:", state.error);
      })

      // Delete Expense
      .addCase(deleteExpenseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExpenseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  addExpense,
  deleteExpense,
  updateExpense,
  clearError,
  setLoading,
} = expensesSlice.actions;
export default expensesSlice.reducer;

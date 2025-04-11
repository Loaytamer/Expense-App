// http.js
import axios from "axios";

const BASE_URL = "https://react-native-1181a-default-rtdb.firebaseio.com/";

export function storeExpense(expenseData) {
  return axios
    .post(`${BASE_URL}/expenses.json`, {
      ...expenseData,
      date: expenseData.date.toISOString(),
    })
    .then((response) => {
      return { id: response.data.name, ...expenseData };
    });
}

export async function fetchExpenses() {
  try {
    const response = await axios.get(`${BASE_URL}/expenses.json`);

    if (!response.data) {
      return []; // Return empty array instead of throwing error
    }

    const expenses = [];
    for (const key in response.data) {
      const expenseData = response.data[key];
      expenses.push({
        id: key,
        amount: expenseData.amount,
        description: expenseData.description,
        date: new Date(expenseData.date).toISOString(),
      });
    }

    return expenses;
  } catch (error) {
    console.log("Fetch error:", error);
    throw new Error("Could not fetch expenses.");
  }
}


export async function updateExpense(id, expenseData) {
  try {
    const response = await axios.put(`${BASE_URL}l/expenses/${id}.json`, {
      amount: expenseData.amount,
      description: expenseData.description,
      date: expenseData.date.toISOString(),
    });

    if (!response.data) {
      throw new Error("Failed to update expense.");
    }

    return {
      id,
      ...expenseData,
      date: expenseData.date.toISOString(),
    };
  } catch (error) {
    console.log("HTTP Error:", error);
    let errorMessage = "Something went wrong while updating the expense!";
    if (error.response) {
      errorMessage = "Server error: Failed to update expense.";
    } else if (error.request) {
      errorMessage = "Network error: Could not reach the server.";
    }
    throw new Error(errorMessage);
  }
}



export async function deleteExpense(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/expenses/${id}.json`);

    // Optionally validate the response if needed
    if (!response.status) {
      throw new Error("Failed to delete expense.");
    }
  } catch (error) {
    throw error; // Rethrow the original error
  }
}

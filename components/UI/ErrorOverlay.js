import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";
import { GlobalStyles } from "../../constants/styles";

function ErrorOverlay({ message, onConfirm }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occurred!</Text>
      <Text style={styles.text}>{message}</Text>
      <Button onPress={onConfirm}>Okay</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    textAlign: "center",
    marginBottom: 8,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default ErrorOverlay;

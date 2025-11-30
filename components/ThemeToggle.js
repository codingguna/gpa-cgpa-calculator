// app/components/ThemeToggle.js
import React, { useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadowDark,
        },
      ]}
    >
      <View style={styles.inner}>
        <MaterialIcons
          name={theme.mode === "light" ? "dark-mode" : "light-mode"}
          size={22}
          color={theme.primary}
        />
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {theme.mode === "light" ? "Dark" : "Light"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    top: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    // deep neumorphic: outer shadows (light + dark)
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 999,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    marginLeft: 8,
  },
});

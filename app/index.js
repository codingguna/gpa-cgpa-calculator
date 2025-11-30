/* eslint-disable react/no-unescaped-entities */
// app/index.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../components/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";


export default function Home() {
  const { theme } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);

  const styles = getStyles(theme);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemeToggle />

      <ScrollView
        contentContainerStyle={[styles.container]}
      >
        {/* MAIN CENTER CONTENT */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>GPA / CGPA{"\n"}Calculator</Text>

          <View style={{ width: "100%", marginTop: 40 }}>
            {/* GPA */}
            <Link href="/gpa" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Calculate GPA</Text>
              </TouchableOpacity>
            </Link>

            {/* CGPA */}
            <Link href="/ogpa" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Calculate CGPA</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* HOW TO USE */}
<TouchableOpacity onPress={toggleExpand} style={styles.howCard}>
  <View style={styles.howHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialIcons
        name="help-outline"
        size={24}
        color={theme.primary}
      />
      <Text style={styles.howTitle}>How to Use</Text>
    </View>

    <MaterialIcons
      name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
      size={28}
      color={theme.primary}
    />
  </View>

  {expanded && (
    <View style={styles.howBody}>
      
      {/* GPA */}
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
        ✔ Calculate GPA
      </Text>

      <View style={styles.stepRow}>
        <Feather name="book" size={18} color={theme.text} />
        <Text style={styles.stepText}>Open GPA page</Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="type" size={18} color={theme.text} />
        <Text style={styles.stepText}>Enter semester name</Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="edit-3" size={18} color={theme.text} />
        <Text style={styles.stepText}>
          Enter subject code, credit hour & grade point
        </Text>
      </View>

      <View style={styles.stepRow}>
        {/* Feather doesn't have calculator → use check-square */}
        <Feather name="check-square" size={18} color={theme.text} />
        <Text style={styles.stepText}>Tap "Calculate GPA"</Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="save" size={18} color={theme.text} />
        <Text style={styles.stepText}>Saved GPA will appear in history</Text>
      </View>

      {/* OGPA */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
        ✔ Calculate OGPA
      </Text>

      <View style={styles.stepRow}>
        <FontAwesome5 name="list" size={16} color={theme.text} />
        <Text style={styles.stepText}>
          Open OGPA page & select saved GPA records
        </Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="plus-circle" size={18} color={theme.text} />
        <Text style={styles.stepText}>
          Or add new GPA records from the GPA page
        </Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="type" size={18} color={theme.text} />
        <Text style={styles.stepText}>Enter OGPA name</Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="check-circle" size={18} color={theme.text} />
        <Text style={styles.stepText}>Tap "Calculate OGPA"</Text>
      </View>

      {/* THEME */}
      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
        ✔ Switch Theme
      </Text>

      <View style={styles.stepRow}>
        <Feather name="sun" size={18} color={theme.text} />
        <Text style={styles.stepText}>Tap sun/moon icon to toggle theme</Text>
      </View>

      <View style={styles.stepRow}>
        <Feather name="toggle-right" size={18} color={theme.text} />
        <Text style={styles.stepText}>Theme changes instantly</Text>
      </View>

    </View>
  )}
</TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------- DYNAMIC STYLES ---------------------- */
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 60,
      backgroundColor: theme.background,
    },

    centerSection: {
      marginTop: 70,
      alignItems: "center",
      marginBottom: 40,
    },

    title: {
      fontSize: 34,
      fontWeight: "800",
      textAlign: "center",
      color: theme.text,
      lineHeight: 40,
    },

    /* BUTTONS */
    actionButton: {
      width: "100%",
      paddingVertical: 18,
      borderRadius: 14,
      marginBottom: 20,
      backgroundColor: theme.primary,
      shadowColor: theme.shadowDark,
      shadowOpacity: 0.2,
      elevation: 3,
    },

    actionText: {
      color: theme.buttonText,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
    },

    /* HOW TO USE CARD */
    howCard: {
      marginTop: 10,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      shadowColor: theme.shadowDark,
      shadowOpacity: 0.15,
      elevation: 6,
    },

    howHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    howTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginLeft: 8,
      color: theme.primary,
    },

    howBody: {
      marginTop: 16,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },

    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 10,
    },

    stepText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.textSecondary,
    },
  });

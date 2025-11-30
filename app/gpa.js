// app/gpa.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeContext } from "../components/ThemeContext";



const round2 = (v) => Math.round(v * 100) / 100;
const createSubject = () => ({ code: "", credit: "", grade: "" });

export default function GPA() {
  const { theme } = useContext(ThemeContext);

  const [semesterName, setSemesterName] = useState("");
  const [subjects, setSubjects] = useState(Array.from({ length: 5 }, createSubject));
  const [gpa, setGpa] = useState(null);
  const [history, setHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("gpa_history");
    if (data) setHistory(JSON.parse(data));
  };

  const saveHistory = async (record) => {
    const updated = [record, ...history];
    setHistory(updated);
    await AsyncStorage.setItem("gpa_history", JSON.stringify(updated));
  };

  const updateHistory = async (updatedHistory) => {
    setHistory(updatedHistory);
    await AsyncStorage.setItem("gpa_history", JSON.stringify(updatedHistory));
  };

  const addSubject = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSubjects((s) => [...s, createSubject()]);
  };

  const deleteSubject = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSubjects((s) => s.filter((_, i) => i !== index));
  };

  const clearAllFields = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSemesterName("");
    setGpa(null);
    setEditingRecord(null);
    setSubjects(Array.from({ length: 5 }, createSubject));
  };

  const updateSubject = (i, field, value) => {
    setSubjects((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  };

  const calculateGPA = () => {
    for (let i = 0; i < subjects.length; i++) {
      const s = subjects[i];
      if (!s.code.trim() || !s.credit.trim() || !s.grade.trim()) {
        Alert.alert("Missing Fields", `Fill all fields for subject ${i + 1}`);
        return;
      }
      if (isNaN(s.credit) || isNaN(s.grade)) {
        Alert.alert("Invalid Input", `Credit & Grade must be numbers (subject ${i + 1})`);
        return;
      }
    }

    let totalCredits = 0;
    let totalWeighted = 0;
    subjects.forEach((s) => {
      const c = parseFloat(s.credit);
      const g = parseFloat(s.grade);
      totalCredits += c;
      totalWeighted += c * g;
    });

    if (totalCredits === 0) {
      setGpa("0.00");
      return;
    }

    const final = round2(totalWeighted / totalCredits).toFixed(2);
    setGpa(final);

    if (editingRecord) {
      const updated = history.map((item) =>
        item.id === editingRecord.id
          ? { ...item, name: semesterName, gpa: final, subjects, totalCredits, totalWeighted, date: new Date().toLocaleString() }
          : item
      );
      updateHistory(updated);
      setEditingRecord(null);
    } else {
      const record = { id: Date.now().toString(), name: semesterName || "Unnamed Semester", gpa: final, subjects, totalCredits, totalWeighted, date: new Date().toLocaleString() };
      saveHistory(record);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSemesterName("");
    setSubjects(Array.from({ length: 5 }, createSubject));
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const deleteRecord = (id) => {
    Alert.alert("Delete Record", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        const updated = history.filter((item) => item.id !== id);
        setHistory(updated);
        await AsyncStorage.setItem("gpa_history", JSON.stringify(updated));
      }},
    ]);
  };

  const clearAll = () => {
    Alert.alert("Clear All Records", "This will delete all GPA records. Continue?", [
      { text: "Cancel" },
      { text: "Clear All", style: "destructive", onPress: async () => {
        setHistory([]); await AsyncStorage.removeItem("gpa_history");
      } },
    ]);
  };

  const editRecord = (rec) => {
    setEditingRecord(rec);
    setSemesterName(rec.name);
    setGpa(rec.gpa);
    setSubjects(rec.subjects.map(s => ({ code: s.code ?? "", credit: s.credit?.toString() ?? "", grade: s.grade?.toString() ?? "" })));
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 120);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={[styles.container]} ref={scrollRef}>
        {/* Add safe spacing from top */}
        <View style={{ height: 40 }} /> 
        <ThemeToggle />
        <Text style={[styles.title, { color: theme.text }]}>GPA Calculator</Text>

        <TextInput
          style={[styles.semInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          placeholder="Enter Semester Name"
          placeholderTextColor={theme.textSecondary}
          value={semesterName}
          onChangeText={setSemesterName}
        />

        <Text style={[styles.subtitle, { color: theme.text }]}>Subjects</Text>

        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { color: theme.textSecondary, flex: 1.3 }]}>Subject</Text>
          <Text style={[styles.headerText, { color: theme.textSecondary, flex: 1 }]}>Credit</Text>
          <Text style={[styles.headerText, { color: theme.textSecondary, flex: 1 }]}>Grade</Text>
          <View style={{ width: 40 }} />
        </View>

        {subjects.map((s, i) => (
          <View key={i} style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              value={s.code}
              onChangeText={(v) => updateSubject(i, "code", v)}
              placeholder="Code"
              placeholderTextColor={theme.textSecondary}
              style={[styles.inputSmall, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
            />
            <TextInput
              value={s.credit}
              onChangeText={(v) => updateSubject(i, "credit", v)}
              placeholder="Cr"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              style={[styles.inputSmall, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
            />
            <TextInput
              value={s.grade}
              onChangeText={(v) => updateSubject(i, "grade", v)}
              placeholder="GP"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              style={[styles.inputSmall, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
            />
            <TouchableOpacity onPress={() => deleteSubject(i)} style={[styles.deleteCircle, { backgroundColor: theme.card }]}>
              <Text style={{ color: "red", fontWeight: "700" }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={addSubject} style={{ alignSelf: "center", marginVertical: 12 }}>
          <Text style={{ color: theme.primary, fontSize: 16 }}>+ Add Subject</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearAllFields} style={{ alignSelf: "center", marginBottom: 16 }}>
          <Text style={{ color: "red", fontSize: 16, fontWeight: "600" }}>Clear All Fields</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 12 }}>
          <Button title={editingRecord ? "Update GPA Record" : "Calculate GPA"} onPress={calculateGPA} color={theme.primary} />
        </View>

        {gpa && <Text style={[styles.result, { color: theme.primary }]}>Semester GPA: {gpa}</Text>}

        <Text style={[styles.subtitle, { color: theme.text, marginTop: 18 }]}>Recent GPA Records</Text>

        {history.length === 0 ? (
          <Text style={{ color: theme.textSecondary, textAlign: "center", marginTop: 10 }}>No previous GPA records.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View>
                <Text style={{ fontSize: 17, fontWeight: "700", color: theme.text }}>{item.name}</Text>
                <Text style={{ color: theme.textSecondary }}>GPA: {item.gpa}</Text>
                <Text style={{ color: theme.textSecondary }}>{item.date}</Text>
              </View>

              <View style={styles.historyActions}>
                <TouchableOpacity onPress={() => editRecord(item)}><Text style={{ color: "green", fontWeight: "700" }}>Edit</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => deleteRecord(item.id)}><Text style={{ color: "red", fontWeight: "700" }}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {history.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={{ alignSelf: "center", marginTop: 14 }}>
            <Text style={{ color: "red", fontSize: 16, fontWeight: "700" }}>Clear All Records</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  semInput: { borderWidth: 1, padding: 12, borderRadius: 12, marginVertical: 12 },
  subtitle: { fontSize: 18, fontWeight: "700", marginTop: 10, marginBottom: 8 },
  headerRow: { flexDirection: "row", marginBottom: 8, alignItems: "center" },
  headerText: { fontSize: 13, fontWeight: "700" },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  inputSmall: { borderWidth: 1, padding: 10, borderRadius: 8, flex: 1, marginRight: 8 },
  deleteCircle: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  result: { fontSize: 22, fontWeight: "800", textAlign: "center", marginTop: 12 },
  historyCard: { padding: 14, borderRadius: 12, marginVertical: 10, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  historyActions: { flexDirection: "row", gap: 16, alignItems: "center" },
});

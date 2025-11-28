import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Round to 2 decimals
const round2 = (value) => Math.round(value * 100) / 100;

// Create an empty subject entry
const createSubject = () => ({
  code: "",
  credit: "",
  grade: "",
});

export default function GPA() {
  const [semesterName, setSemesterName] = useState("");
  const [subjects, setSubjects] = useState(
    Array.from({ length: 5 }, () => createSubject())
  );
  const [gpa, setGpa] = useState(null);
  const [history, setHistory] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

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
    setSubjects([...subjects, createSubject()]);
  };

  const deleteSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const clearAllFields = () => {
    setSemesterName("");
    setGpa(null);
    setEditingRecord(null);
    setSubjects(Array.from({ length: 5 }, () => createSubject()));
  };

  const updateSubject = (i, field, value) => {
    const updated = [...subjects];
    updated[i] = { ...updated[i], [field]: value };
    setSubjects(updated);
  };

  // 🎯 GPA = Σ(Ci×GPi) / ΣCi
  const calculateGPA = () => {
    let totalCredits = 0;
    let totalWeighted = 0;

    subjects.forEach((s) => {
      const c = parseFloat(s.credit);
      const g = parseFloat(s.grade);

      if (!isNaN(c) && !isNaN(g)) {
        totalCredits += c;
        totalWeighted += c * g;
      }
    });

    if (totalCredits === 0) {
      setGpa("0.00");
      return;
    }

    const raw = totalWeighted / totalCredits;
    const rounded = round2(raw);

    setGpa(rounded.toFixed(2));

    if (editingRecord) {
      const updatedHistory = history.map((item) =>
        item.id === editingRecord.id
          ? {
              ...item,
              name: semesterName,
              gpa: rounded.toFixed(2),
              subjects,
              date: new Date().toLocaleString(),
            }
          : item
      );

      updateHistory(updatedHistory);
      setEditingRecord(null);
      return;
    }

    const record = {
      id: Date.now().toString(),
      name: semesterName || "Unnamed Semester",
      gpa: rounded.toFixed(2),
      subjects,
      totalCredits: totalCredits,     
      totalWeighted: totalWeighted,
      date: new Date().toLocaleString(),
    };

    saveHistory(record);
  };

  const deleteRecord = (id) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = history.filter((item) => item.id !== id);
            setHistory(updated);
            await AsyncStorage.setItem("gpa_history", JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const clearAll = () => {
    Alert.alert(
      "Clear All Records",
      "This will delete ALL GPA records. Continue?",
      [
        { text: "Cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem("gpa_history");
          },
        },
      ]
    );
  };

  const editRecord = (record) => {
    setEditingRecord(record);
    setSemesterName(record.name);
    setGpa(record.gpa);

    const cleanSubjects = record.subjects.map((s) => ({
      code: s.code ?? "",
      credit: s.credit?.toString() ?? "",
      grade: s.grade?.toString() ?? "",
    }));

    setSubjects(cleanSubjects);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>GPA Calculator</Text>

      <TextInput
        style={styles.semInput}
        placeholder="Enter Semester Name"
        value={semesterName}
        onChangeText={setSemesterName}
      />

      <Text style={styles.subtitle}>Subjects</Text>
      <View style={styles.subjectHeaderRow}>
        <Text style={[styles.subjectHeaderText, { flex: 1 }]}>Subject Code</Text>
        <Text style={[styles.subjectHeaderText, { flex: 1 }]}>Credit Hours</Text>
        <Text style={[styles.subjectHeaderText, { flex: 1 }]}>Grade Point</Text>
      </View>

      {/* SUBJECT LIST */}
      {subjects.map((s, i) => (
        <View key={i} style={styles.rowBlock}>
          {/* Subject Code */}
          <TextInput
            style={[styles.inputSmall, { flex: 1.5 }]}
            placeholder="Code"
            value={s.code}
            onChangeText={(v) => updateSubject(i, "code", v)}
          />

          {/* Credit */}
          <TextInput
            style={[styles.inputSmall, { flex: 1 }]}
            placeholder="Cr"
            keyboardType="numeric"
            value={s.credit}
            onChangeText={(v) => updateSubject(i, "credit", v)}
          />

          {/* Grade */}
          <TextInput
            style={[styles.inputSmall, { flex: 1 }]}
            placeholder="GP"
            keyboardType="numeric"
            value={s.grade}
            onChangeText={(v) => updateSubject(i, "grade", v)}
          />

          {/* Delete Subject Row */}
          <TouchableOpacity
            onPress={() => deleteSubject(i)}
            style={styles.deleteBtn}
          >
            <Text style={styles.delText}>✖</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ADD SUBJECT BUTTON */}
      <TouchableOpacity style={styles.addButton} onPress={addSubject}>
        <Text style={styles.addText}>+ Add Subject</Text>
      </TouchableOpacity>

      {/* CLEAR ALL INPUT FIELDS */}
      <TouchableOpacity style={styles.clearInputFields} onPress={clearAllFields}>
        <Text style={styles.clearInputText}>Clear All Fields</Text>
      </TouchableOpacity>

      {/* CALCULATE BUTTON */}
      <Button
        title={editingRecord ? "Update GPA Record" : "Calculate GPA"}
        onPress={calculateGPA}
      />

      {gpa && <Text style={styles.result}>Semester GPA: {gpa}</Text>}

      {/* HISTORY */}
      <Text style={styles.subtitle}>Recent GPA Records</Text>

      {history.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#777" }}>
          No previous GPA records found.
        </Text>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.historyName}>{item.name}</Text>
            <Text style={styles.historyGpa}>GPA: {item.gpa}</Text>
            <Text style={styles.historyTime}>{item.date}</Text>

            <View style={styles.historyActions}>
              <TouchableOpacity onPress={() => editRecord(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteRecord(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {history.length > 0 && (
        <TouchableOpacity style={styles.clearAll} onPress={clearAll}>
          <Text style={styles.clearAllText}>Clear All Records</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  semInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  
  subjectHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  subjectHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  /* --- Subject Row Style --- */
  rowBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },

  inputSmall: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
  },

  deleteBtn: {
    backgroundColor: "#ffdddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  delText: {
    color: "red",
    fontWeight: "bold",
  },

  addButton: {
    alignSelf: "center",
    marginVertical: 10,
  },

  addText: { color: "#0077ff", fontSize: 16 },

  clearInputFields: {
    alignSelf: "center",
    marginBottom: 20,
  },

  clearInputText: {
    color: "red",
    fontSize: 16,
    fontWeight: "600",
  },

  result: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#0077ff",
  },

  /* --- History Section --- */
  historyItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  historyName: { fontSize: 18, fontWeight: "bold" },
  historyGpa: { fontSize: 16, marginTop: 4 },
  historyTime: { fontSize: 13, color: "#666", marginTop: 4 },

  historyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  editText: { color: "green", fontWeight: "600" },
  deleteText: { color: "red", fontWeight: "600" },

  clearAll: { marginTop: 20, alignSelf: "center" },
  clearAllText: { color: "red", fontSize: 16, fontWeight: "700" },
});

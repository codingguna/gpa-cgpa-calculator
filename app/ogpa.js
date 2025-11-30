// app/ogpa.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeContext } from "../components/ThemeContext";


const round2 = (v) => Math.round(v * 100) / 100;

export default function OGPA() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [mode, setMode] = useState(null);
  const [gpaHistory, setGpaHistory] = useState([]);
  const [ogpaHistory, setOgpaHistory] = useState([]);

  const [selected, setSelected] = useState([]);
  const [ogpaName, setOgpaName] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const gpa = await AsyncStorage.getItem("gpa_history");
    const ogpa = await AsyncStorage.getItem("ogpa_history");
    if (gpa) setGpaHistory(JSON.parse(gpa));
    if (ogpa) setOgpaHistory(JSON.parse(ogpa));
  };

  const toggleSelect = (id) => {
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const calculateOGPA = () => {
    if (selected.length === 0) return Alert.alert("Select Semesters", "Choose at least one semester.");
    if (!ogpaName.trim()) return Alert.alert("Enter Name", "Please enter OGPA name.");

    let totalCredits = 0;
    let totalWeighted = 0;

    selected.forEach((id) => {
      const rec = gpaHistory.find((x) => x.id === id);
      if (rec) {
        totalCredits += rec.totalCredits || 0;
        totalWeighted += rec.totalWeighted || 0;
      }
    });

    const result = round2(totalWeighted / totalCredits).toFixed(2);

    const record = {
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      name: ogpaName,
      ogpa: result,
      totalCredits,
      totalWeighted,
      semesters: selected,
      date: new Date().toLocaleString(),
    };

    let updated;
    if (editingRecord) {
      updated = ogpaHistory.map((x) => (x.id === editingRecord.id ? record : x));
      setEditingRecord(null);
    } else {
      updated = [record, ...ogpaHistory];
    }

    setOgpaHistory(updated);
    AsyncStorage.setItem("ogpa_history", JSON.stringify(updated));
    Alert.alert("Saved", `OGPA saved: ${result}`);
    setOgpaName("");
    setSelected([]);
  };

  const deleteOGPA = (id) => {
    Alert.alert("Delete OGPA", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        const updated = ogpaHistory.filter((x) => x.id !== id);
        setOgpaHistory(updated);
        await AsyncStorage.setItem("ogpa_history", JSON.stringify(updated));
      }},
    ]);
  };

  const editOGPA = (r) => {
    setMode("recent");
    setEditingRecord(r);
    setOgpaName(r.name);
    setSelected(r.semesters);
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((e) => (e === id ? null : id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={[styles.container]}>
        {/* Add safe spacing from top */}
        <View style={{ height: 40 }} />

        <ThemeToggle />
        <Text style={[styles.title, { color: theme.text }]}>OGPA Calculator</Text>

        {!mode && (
          <>
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => setMode("recent")}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}>Calculate from Recent GPA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnSecondary, { borderColor: theme.primary }]} onPress={() => router.push("/gpa")}>
              <Text style={[styles.btnTextSecondary, { color: theme.primary }]}>Add New Semester Records</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === "recent" && (
          <>
            <Text style={[styles.subtitle, { color: theme.text }]}>Select Semesters</Text>

            {gpaHistory.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>No GPA records found.</Text>
            ) : (
              gpaHistory.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleSelect(item.id)}
                  style={[
                    styles.gpaCard,
                    {
                      backgroundColor: selected.includes(item.id) ? theme.primarySoft.replace("22", "33") : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}>{item.name}</Text>
                    <Text style={{ color: theme.textSecondary }}>GPA: {item.gpa}</Text>
                  </View>
                  <View>
                    <Text style={{ color: theme.textSecondary }}>Credits: {item.totalCredits}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            <TextInput
              value={ogpaName}
              onChangeText={setOgpaName}
              placeholder="Enter OGPA Name"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
            />

            <TouchableOpacity style={[styles.calcBtn, { backgroundColor: theme.primary }]} onPress={calculateOGPA}>
              <Text style={[styles.calcText, { color: theme.buttonText }]}>{editingRecord ? "Update OGPA" : "Calculate OGPA"}</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={[styles.subtitle, { color: theme.text, marginTop: 20 }]}>Saved OGPA</Text>

        {ogpaHistory.length === 0 ? <Text style={{ color: theme.textSecondary }}>No OGPA saved.</Text> :
          ogpaHistory.map((item) => (
            <View key={item.id} style={[styles.ogpaCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>{item.name}</Text>
                <Text style={{ color: theme.textSecondary }}>OGPA: {item.ogpa}</Text>
              </TouchableOpacity>

              {expandedId === item.id && (
                <View style={[styles.expandBox, { backgroundColor: theme.cardInner, borderColor: theme.border }]}>
                  <Text style={{ color: theme.text, fontWeight: "700" }}>Included Semesters</Text>
                  {item.semesters.map((sid) => {
                    const sem = gpaHistory.find((x) => x.id === sid);
                    if (!sem) return null;
                    return (
                      <View key={sid} style={[styles.semRow, { borderBottomColor: theme.border }]}>
                        <Text style={{ color: theme.text }}>{sem.name}</Text>
                        <Text style={{ color: theme.textSecondary }}>GPA: {sem.gpa}</Text>
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={styles.rowBtns}>
                <TouchableOpacity onPress={() => editOGPA(item)}><Text style={{ color: "green", fontWeight: "700" }}>Edit</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => deleteOGPA(item.id)}><Text style={{ color: "red", fontWeight: "700" }}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  btn: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12, alignItems: "center", shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 8 },
  btnSecondary: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12, alignItems: "center" },
  btnTextSecondary: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  gpaCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 6 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginVertical: 12 },
  calcBtn: { padding: 14, borderRadius: 12, alignItems: "center" },
  calcText: { fontSize: 16, fontWeight: "700" },
  ogpaCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginVertical: 8 },
  expandBox: { padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1 },
  semRow: { paddingVertical: 8, borderBottomWidth: 1 },
  rowBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});

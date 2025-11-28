import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Enable smooth animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// round to 2 decimals
const round2 = (v) => Math.round(v * 100) / 100;

export default function OGPA() {
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
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const calculateOGPA = () => {
    if (selected.length === 0) {
      Alert.alert("Select Semesters", "Choose at least one semester.");
      return;
    }
    if (!ogpaName.trim()) {
      Alert.alert("Enter Name", "Please enter OGPA name.");
      return;
    }

    let totalCredits = 0;
    let totalWeighted = 0;

    selected.forEach((id) => {
      const rec = gpaHistory.find((x) => x.id === id);
      if (rec) {
        totalCredits += rec.totalCredits || 0;
        totalWeighted += rec.totalWeighted || 0;
      }
    });

    const ogpaValue = round2(totalWeighted / totalCredits).toFixed(2);

    const record = {
      id: editingRecord ? editingRecord.id : Date.now().toString(),
      name: ogpaName,
      ogpa: ogpaValue,
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

    Alert.alert("Success", `OGPA saved as ${ogpaValue}`);

    setOgpaName("");
    setSelected([]);
  };

  const deleteOGPA = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this OGPA record?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = ogpaHistory.filter((x) => x.id !== id);
          setOgpaHistory(updated);
          await AsyncStorage.setItem("ogpa_history", JSON.stringify(updated));
        },
      },
    ]);
  };

  const editOGPA = (record) => {
    setMode("recent");
    setEditingRecord(record);
    setOgpaName(record.name);
    setSelected(record.semesters);
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>OGPA Calculator</Text>

      {!mode && (
        <>
          <TouchableOpacity style={styles.btn} onPress={() => setMode("recent")}>
            <Text style={styles.btnText}>Calculate from Recent GPA Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push("/gpa")}
          >
            <Text style={styles.btnTextSecondary}>Add New Semester Records</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Recent GPA Mode */}
      {mode === "recent" && (
        <>
          <Text style={styles.subtitle}>Select Semesters</Text>

          {gpaHistory.length === 0 ? (
            <Text style={styles.noData}>No GPA records found.</Text>
          ) : (
            gpaHistory.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.gpaItem,
                  selected.includes(item.id) && styles.selectedItem,
                ]}
                onPress={() => toggleSelect(item.id)}
              >
                <Text style={styles.semName}>{item.name}</Text>
                <Text>GPA: {item.gpa}</Text>
                <Text>Credits: {item.totalCredits}</Text>
              </TouchableOpacity>
            ))
          )}

          {/* OGPA name input */}
          <TextInput
            style={styles.input}
            placeholder="Enter OGPA Name"
            value={ogpaName}
            onChangeText={setOgpaName}
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculateOGPA}>
            <Text style={styles.calcText}>
              {editingRecord ? "Update OGPA" : "Calculate OGPA"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* OGPA SAVED LIST */}
      <Text style={[styles.subtitle, { marginTop: 30 }]}>Saved OGPA</Text>

      {ogpaHistory.length === 0 ? (
        <Text style={styles.noData}>No OGPA records saved.</Text>
      ) : (
        ogpaHistory.map((item) => (
          <View key={item.id} style={styles.ogpaItem}>
            {/* Touchable Header */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.semName}>{item.name}</Text>
              <Text>OGPA: {item.ogpa}</Text>
              <Text>Total Credits: {item.totalCredits}</Text>
            </TouchableOpacity>

            {/* EXPANDED DETAILS */}
            {expandedId === item.id && (
              <View style={styles.expandBox}>
                <Text style={styles.expTitle}>Included Semesters:</Text>

                {item.semesters.map((sid) => {
                  const sem = gpaHistory.find((x) => x.id === sid);
                  if (!sem) return null;
                  return (
                    <View key={sid} style={styles.expItem}>
                      <Text style={styles.expSemName}>{sem.name}</Text>
                      <Text>GPA: {sem.gpa}</Text>
                      <Text>Credits: {sem.totalCredits}</Text>
                      <Text>Weighted: {sem.totalWeighted}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => editOGPA(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteOGPA(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: { fontSize: 20, fontWeight: "600", marginTop: 20 },

  btn: {
    backgroundColor: "#0077ff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },

  btnText: { color: "white", textAlign: "center", fontSize: 16 },

  btnSecondary: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0077ff",
  },

  btnTextSecondary: {
    color: "#0077ff",
    textAlign: "center",
    fontSize: 16,
  },

  gpaItem: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },

  selectedItem: {
    backgroundColor: "#d0e8ff",
    borderWidth: 1,
    borderColor: "#0077ff",
  },

  semName: { fontSize: 18, fontWeight: "bold" },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
  },

  calcBtn: {
    backgroundColor: "#009944",
    padding: 14,
    borderRadius: 8,
  },

  calcText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  ogpaItem: {
    backgroundColor: "#e3ffe6",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  expandBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  expTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },

  expItem: {
    backgroundColor: "#f5faff",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },

  expSemName: { fontWeight: "600", fontSize: 16 },

  noData: {
    marginTop: 10,
    color: "#777",
    fontSize: 16,
  },

  rowBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  editText: { color: "green", fontWeight: "600" },
  deleteText: { color: "red", fontWeight: "600" },
});

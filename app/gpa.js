import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function GPA() {
  const [subjects, setSubjects] = useState([{ credit: "", grade: "" }]);
  const [gpa, setGpa] = useState(null);

  const addSubject = () => {
    setSubjects([...subjects, { credit: "", grade: "" }]);
  };

  const update = (i, field, value) => {
    const copy = [...subjects];
    copy[i][field] = value;
    setSubjects(copy);
  };

  const calculate = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((s) => {
      const c = parseFloat(s.credit);
      const g = parseFloat(s.grade);

      if (!isNaN(c) && !isNaN(g)) {
        totalCredits += c;
        totalPoints += c * g;
      }
    });

    setGpa((totalPoints / totalCredits).toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPA Calculator</Text>

      {subjects.map((s, i) => (
        <View key={i} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Credit"
            keyboardType="numeric"
            value={s.credit}
            onChangeText={(v) => update(i, "credit", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Grade Point"
            keyboardType="numeric"
            value={s.grade}
            onChangeText={(v) => update(i, "grade", v)}
          />
        </View>
      ))}

      <Button title="Add Subject" onPress={addSubject} />
      <View style={{ height: 10 }} />
      <Button title="Calculate GPA" onPress={calculate} />

      {gpa && <Text style={styles.result}>Your GPA: {gpa}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", gap: 10, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  result: { fontSize: 22, marginTop: 20, fontWeight: "bold" },
});

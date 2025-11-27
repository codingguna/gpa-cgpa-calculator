import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function CGPA() {
  const [semesters, setSemesters] = useState([{ gpa: "" }]);
  const [cgpa, setCgpa] = useState(null);

  const addSemester = () => {
    setSemesters([...semesters, { gpa: "" }]);
  };

  const update = (i, v) => {
    const copy = [...semesters];
    copy[i].gpa = v;
    setSemesters(copy);
  };

  const calculate = () => {
    const valid = semesters
      .map((s) => parseFloat(s.gpa))
      .filter((g) => !isNaN(g));

    const sum = valid.reduce((a, b) => a + b, 0);
    setCgpa((sum / valid.length).toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CGPA Calculator</Text>

      {semesters.map((s, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={`Semester ${i + 1} GPA`}
          keyboardType="numeric"
          value={s.gpa}
          onChangeText={(v) => update(i, v)}
        />
      ))}

      <Button title="Add Semester" onPress={addSemester} />
      <View style={{ height: 10 }} />
      <Button title="Calculate CGPA" onPress={calculate} />

      {cgpa && <Text style={styles.result}>Your CGPA: {cgpa}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  result: { fontSize: 22, marginTop: 20, fontWeight: "bold" },
});

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPA / CGPA Calculator</Text>

      <Link href="/gpa" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Calculate GPA</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/ogpa" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.btnText}>Calculate OGPA</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0077ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});

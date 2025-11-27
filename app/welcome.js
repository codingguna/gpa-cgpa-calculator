import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  const handleStart = async () => {
    await AsyncStorage.setItem("welcome_seen", "true");
    router.replace("/"); // go to home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 🎉</Text>
      <Text style={styles.subtitle}>GPA / CGPA Calculator App</Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    color: "#444",
  },
  button: {
    backgroundColor: "#0077ff",
    padding: 15,
    borderRadius: 12,
    width: "70%",
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
});

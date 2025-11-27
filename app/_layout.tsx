import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [firstLaunch, setFirstLaunch] = useState(false);

  useEffect(() => {
    const checkWelcome = async () => {
      const seen = await AsyncStorage.getItem("welcome_seen");

      if (seen === null) {
        // first time open
        setFirstLaunch(true);
      }

      setLoading(false);
    };

    checkWelcome();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {firstLaunch && <Stack.Screen name="welcome" />}
      <Stack.Screen name="index" />
      <Stack.Screen name="gpa" />
      <Stack.Screen name="cgpa" />
    </Stack>
  );
}

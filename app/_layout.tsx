import { ThemeProvider } from "../components/ThemeContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="index" />
        <Stack.Screen name="gpa" />
        <Stack.Screen name="ogpa" />
      </Stack>
    </ThemeProvider>
  );
}

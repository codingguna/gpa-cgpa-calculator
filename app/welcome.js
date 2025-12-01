import { useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../components/ThemeContext";

const { width } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/");
    }, 2500); // faster and smoother

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* LOGO */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        }}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />
      </Animated.View>

      {/* TITLE */}
      <Animated.Text
        style={[
          styles.title,
          { color: theme.text, opacity: fadeAnim }
        ]}
      >
        GPA / CGPA Calculator
      </Animated.Text>

      {/* LOADING */}
      <Animated.Text
        style={[
          styles.loading,
          { color: theme.primary, opacity: fadeAnim }
        ]}
      >
        Loading...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: width * 0.45,  // responsive size
    height: width * 0.45,
    resizeMode: "contain",
    borderRadius: 20,
  },

  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  loading: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});

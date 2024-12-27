import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView,View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown:false
      }}/>
      {/* <StatusBar style="auto" /> */}
    </Stack>
  )
}

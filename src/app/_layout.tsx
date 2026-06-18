import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function Layout(){
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FDFDFD"
                translucent={false}
            />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#FDFDFD" }
                }}
            />
        </>
    )
}

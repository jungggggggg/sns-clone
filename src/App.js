import { StatusBar } from "expo-status-bar";
import Navigation from "./navigations/Navigation";
import { LogBox } from "react-native";
import { UserProvider } from "./contexts/UserContext";

const App = () => {
    LogBox.ignoreLogs([
        'AsyncStorage has been extracted from react-natvie core',
    ])

    return (
        <UserProvider>
            <StatusBar style="dark" />
            <Navigation />
        </UserProvider>
    )
}

export default App;
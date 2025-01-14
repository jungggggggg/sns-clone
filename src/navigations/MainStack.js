import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WHITE } from "../colors";
import { MainRoutes } from "./routes";
import ProfileScreen from "../screens/ProfileScreen";
import ContentTab from "./ContentTab";
import SelectPhotoScreen from "../screens/SelectPhotoScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import HeaderLeft from "../components/HeaderLeft";
import ImagePickerScreen from "../screens/ImagePickerScreen";



const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            contentStyle: { backgroundColor: WHITE},
            title: '',
            headerLeft: HeaderLeft,
        }}
        >
            <Stack.Screen name={MainRoutes.CONTENT_TAB} component={ContentTab} options={{headerShown: false}}/>
            <Stack.Screen
            name={MainRoutes.SELECT_PHOTOS}
            component={SelectPhotoScreen}
            />
            <Stack.Screen
            name={MainRoutes.UPDATE_PROFILE}
            component={UpdateProfileScreen}
            />
            <Stack.Screen
            name={MainRoutes.IMAGE_PICKER}
            component={ImagePickerScreen}
            />
        </Stack.Navigator>
    )
}

export default MainStack;
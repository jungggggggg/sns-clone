import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, ScrollView, Keyboard, Alert } from "react-native";
import { AuthRoutes } from "../navigations/routes";
import Input from "../components/Input";
import { ReturnKeyTypes, InputTypes } from "../components/Input";
import { useRef, useReducer, useCallback } from "react";
import Button from "../components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeInputView from "../components/SafeInputView";
import TextButton from "../components/TextButton";
import HR from "../components/HR";
import { StatusBar } from "expo-status-bar";
import { WHITE } from "../colors";
import { authFormReducer, AuthFormTypes, initAuthForm } from "../reducers/authFormReducer";
import { signIn } from "../api/auth";
import { getAuthErrorMessages } from "../api/auth";
import { getAuth } from "firebase/auth";
import { useUserState } from "../contexts/UserContext";



const SignInScreen = () => {
    const navigation = useNavigation();
    const { top, bottom } = useSafeAreaInsets();

    const passwordRef = useRef();

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm)

    const [, setUser] = useUserState();

    useFocusEffect(
        useCallback(() => {
            return() => dispatch({ type: AuthFormTypes.RESET })
    }, [])
)

    const updateForm = (payload) => {
        const newForm = { ...form, ...payload }
        const disabled = !newForm.email || !newForm.password;
    dispatch({
        type: AuthFormTypes.UPDATE_FORM,
        payload: { disabled, ...payload },
    })
    }

    const onSubmit = async () => {
        Keyboard.dismiss();
        if (!form.disabled && !form.isLoading) {
            dispatch({ type: AuthFormTypes.TOGGLE_LOADING});
            try {
            const user = await signIn(form)
            setUser(user)
            } catch (e) {
                const message = getAuthErrorMessages(e.code)
                Alert.alert('로그인 실패', message, [
                    {
                        text: '확인',
                        onPress: () => dispatch({ type: AuthFormTypes.TOGGLE_LOADING })
                    }
                ])
            }

        }
    }

    return (
        <SafeInputView>
            <StatusBar style="light" />
            <View style={[styles.container, { paddingTop: top }]}>
                <View style={StyleSheet.absoluteFill}>
                    <Image source={require('../../assets/cover.png')}
                    style={{ width: '100%' }}
                    resizeMode="cover"
                    />
                </View>

                <ScrollView style={[
                    styles.form, 
                    {paddingBottom: bottom ? bottom + 10 : 40 },
                ]}
                contentContainerStyle={{ alignItems: 'center' }}
                bounces={false}
                keyboardShouldPersistTaps="always"
                    >
                <Input
                    value={form.email}
                    onChangeText={(text) => updateForm({ email: text.trim()})}
                    inputType={InputTypes.EMAIL}
                    returnKeyType={ReturnKeyTypes.NEXT}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    styles={{ container: { marginBottom: 20 }}}
                />
                <Input
                ref={passwordRef}
                    styles={{container: { marginBottom: 20 }}}
                    value={form.password}
                    onChangeText={(text) => updateForm({ password: text.trim()})}
                    inputType={InputTypes.PASSWORD}
                    returnKeyType={ReturnKeyTypes.DONE}
                    onSubmitEditing={onSubmit}
                />
                <Button
                   title="로그인"
                   onPress={onSubmit}
                   disabled={form.disabled}
                   isLoading={form.isLoading}
                   styles={{ container: { marginTop: 20 } }}
                />
                <HR text={'OR'} styles={{ container: { marginVertical: 30} }} />
                <TextButton
                title={'회원가입'}
                onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
                />
                </ScrollView>
            </View>
        </SafeInputView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    form: {
        flexGrow: 0,
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
})

export default SignInScreen;
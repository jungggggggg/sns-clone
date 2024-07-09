import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Pressable, Alert, Keyboard, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SafeInputView from '../components/SafeInputView';
import HeaderRight from '../components/HeaderRight';
import FastImage from '../components/FastImage';
import { updateUserInfo } from '../api/auth';
import { MainRoutes } from '../navigations/routes';
import { useUserState } from '../contexts/UserContext';
import { getLocalUri } from '../components/ImagePicker';
import { uploadPhoto } from '../api/storage';
import { GRAY, WHITE } from '../colors';

const UpdateProfileScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const [user, setUser] = useUserState();

    const [photo, setPhoto] = useState({ uri: user.photoURL });
    const [displayName, setDisplayName] = useState(user.displayName);
    const [disabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (params) {
            const { selectedPhotos } = params;
            if (selectedPhotos?.length) {
                setPhoto(selectedPhotos[0]);
            }
        }
    }, [params]);

    useEffect(() => {
        setDisabled(!displayName || isLoading);
    }, [displayName, isLoading]);

    const onSubmit = useCallback(async () => {
        Keyboard.dismiss();
        if (!disabled && !isLoading) {
            setIsLoading(true);
            try {
                const localUri = await getLocalUri(photo.uri); // 수정된 부분
                const photoURL = await uploadPhoto({
                    uri: localUri,
                    uid: user.uid,
                });

                console.log(localUri)

                const userInfo = { displayName, photoURL };
                await updateUserInfo(userInfo);
                setUser((prev) => ({ ...prev, ...userInfo }));

                navigation.goBack();
            } catch (e) {
                Alert.alert('사용자 수정 실패', e.message);
                setIsLoading(false);
            }
        }
    }, [disabled, displayName, navigation, setUser, photo.uri, user.uid]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRight disabled={disabled} onPress={onSubmit} />,
        });
    }, [navigation, disabled, onSubmit]);

    return (
        <SafeInputView>
            <View style={styles.container}>
                <Button title="Back" onPress={() => navigation.goBack()} />
                <View style={[styles.photo, user.photoURL || { backgroundColor: GRAY.DEFAULT }]}>
                    <FastImage source={{ uri: photo.uri }} style={styles.photo} />
                    <Pressable style={styles.imageButton} onPress={() => navigation.navigate(MainRoutes.IMAGE_PICKER)}>
                        <MaterialCommunityIcons name="image" size={20} color={WHITE} />
                    </Pressable>
                </View>
                <View>
                    <TextInput
                        value={displayName}
                        onChangeText={(text) => setDisplayName(text.trim())}
                        style={styles.input}
                        placeholder="Nickname"
                        textAlign="center"
                        maxLength={10}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="none"
                    />
                </View>
            </View>
        </SafeInputView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    photo: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    imageButton: {
        position: 'absolute',
        bottom: 0,
        right: 20,
        width: 30,
        height: 30,
        backgroundColor: GRAY.DARK,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginTop: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: 200,
        fontSize: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: GRAY.DEFAULT,
    },
});

export default UpdateProfileScreen;
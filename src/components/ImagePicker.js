import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, Alert, FlatList } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import PropTypes from 'prop-types';
import PhotoItem from "./PhotoItem";
import * as FileSystem from 'expo-file-system';

export const getLocalUri = async (uri) => { // 수정된 부분
    let localUri = uri;
    if (localUri.startsWith('ph://')) {
        const asset = await MediaLibrary.createAssetAsync(localUri);
        const fileUri = `${FileSystem.documentDirectory}${asset.filename}`;
        await FileSystem.copyAsync({
            from: localUri,
            to: fileUri
        });
        localUri = fileUri;
    }
    return localUri;
};

const initialListInfo = { endCursor: '', hasNextPage: true };

const ImagePicker = ({ togglePhoto, isSelectedPhoto }) => {
    const navigation = useNavigation();
    const [status, requestPermission] = MediaLibrary.usePermissions();

    const [photos, setPhotos] = useState([]);
    const listInfo = useRef({ endCursor: '', hasNextPage: true });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                Alert.alert('사진 접근 권한', '사진 접근 권한에 동의가 필요합니다', [{
                    text: '확인',
                    onPress: () => {
                        navigation.canGoBack() && navigation.goBack();
                    }
                }]);
            }
        })();
    }, [navigation, requestPermission]);

    const getPhotos = useCallback(async () => {
        const options = {
            first: 30,
            sortBy: [MediaLibrary.SortBy.creationTime],
        };
        if (listInfo.current.endCursor) {
            options['after'] = listInfo.current.endCursor;
        }

        if (listInfo.current.hasNextPage) {
            const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync(options);
            setPhotos((prev) => (options.after ? [...prev, ...assets] : assets));
            listInfo.current = { endCursor, hasNextPage };
        }
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        listInfo.current = initialListInfo;
        await getPhotos();
        setRefreshing(false);
    };

    useEffect(() => {
        if (status?.granted) {
            getPhotos();
        }
    }, [getPhotos, status?.granted]);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={photos}
                renderItem={({ item }) => (
                    <PhotoItem
                        item={item}
                        togglePhoto={togglePhoto}
                        isSelected={isSelectedPhoto(item)}
                    />
                )}
                numColumns={3}
                onEndReached={getPhotos}
                onEndReachedThreshold={0.4}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
};

ImagePicker.propTypes = {
    togglePhoto: PropTypes.func.isRequired,
    isSelectedPhoto: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        width: '100%',
    },
});

export default ImagePicker;
import { useState, useEffect } from "react";
import { Image } from "react-native";
import PropTypes from 'prop-types';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

const FastImage = ({ source, ...props }) => {
    const [uri, setUri] = useState(source.uri);

    useEffect(() => {
        (async () => {
            try {
                const hashed = await Crypto.digestStringAsync(
                    Crypto.CryptoDigestAlgorithm.SHA256,
                    source.uri
                );
                // 파일 확장자 추가
                const fileExtension = source.uri.split('.').pop();
                const fileSystemUri = `${FileSystem.cacheDirectory}${hashed}.${fileExtension}`;

                const metadata = await FileSystem.getInfoAsync(fileSystemUri);
                if (!metadata.exists) {
                    await FileSystem.downloadAsync(source.uri, fileSystemUri);
                }
                setUri(fileSystemUri);
            } catch (e) {
                setUri(source.uri);
            }
        })();
    }, [source.uri]);

    return <Image source={{ uri }} {...props} />;
}

FastImage.propTypes = {
    source: PropTypes.object.isRequired,
};

export default FastImage;
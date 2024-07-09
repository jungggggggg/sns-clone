import { ref, getStorage, uploadBytes } from "firebase/database";
import { getStream, getDownloadURL, } from "firebase/storage";


export const uploadPhoto = async ({uri, uid}) => {
    if (uri.startWith('https')) {
        return uri;
    }

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        }
        xhr.onerror = function (e) {
            console.log('blob onError:', e);
            reject(new Error('사진업로드에 실패했습니다'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
    })

    const filename = uri.split('/').pop();
    const storageRef = ref(getStorage(), `/${uid}/${filename}`);
    await uploadBytes(storageRef, blob);

    blob.close();

    return await getDownloadURL(storageRef);
}
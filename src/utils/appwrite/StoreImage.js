import { ID, Storage } from "appwrite";
import { client } from "./AppwriteClient";
import { useSelector } from "react-redux";
const storage = new Storage(client);

export const StoreMetaImage = (file, bucketId) => {

    return new Promise((resolve, reject) => {
        storage.createFile(
            bucketId,
            ID.unique(),
            file
        )
        .then(response => {
            const result = storage.getFileDownload(response.bucketId, response.$id);
            const imageURL = `${result.pathname.replace("download", "view")}${result.search}`;
            resolve(imageURL);
        })
        .catch(error => {
            console.log(error);
            reject(error);
        });
    });
}

export const StoreSettingImage = (file, bucketId) => {

    return new Promise((resolve, reject) => {
        storage.createFile(
            bucketId,
            ID.unique(),
            file
        )
        .then(response => {
            const result = storage.getFileDownload(response.bucketId, response.$id);
            const imageURL = `${result.pathname.replace("download", "view")}${result.search}`;
            resolve(imageURL);
        })
        .catch(error => {
            console.log(error);
            reject(error);
        });
    });
}
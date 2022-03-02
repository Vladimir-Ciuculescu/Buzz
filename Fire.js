import { AsyncStorage } from "react-native";
import firebase from "firebase";

class Fire {
  constructor() {}

  addPost = async ({ text, localUri }) => {
    const remoteUri = await this.uploadPhotoAsync(localUri);

    const userId = await AsyncStorage.getItem("userId");
    const avatar = await AsyncStorage.getItem("avatar");

    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text: text,
          uid: userId,
          timestamp: this.timestamp,
          image: remoteUri,
          avatar: avatar,
          type: "informational",
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  addAvatar = async ({ localUri, user }) => {
    const remoteUri = await this.uploadPhotoAsync(localUri);
    return new Promise((res, rej) => {
      this.firestore
        .collection("accounts")
        .doc(user)
        .update({
          avatar: remoteUri,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  uploadPhotoAsync = async (uri) => {
    const path = `photos/${Date.now()}.jpg`;

    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();

export default Fire;

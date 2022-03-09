import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBiGTaFqnFoT2aj5KkvgoAr422VsVgMKtA",
  authDomain: "wadwad-60664.firebaseapp.com",
  projectId: "wadwad-60664",
  storageBucket: "wadwad-60664.appspot.com",
  messagingSenderId: "1005852185814",
  appId: "1:1005852185814:web:1cc3df7a46a96c7e5de577",
  measurementId: "G-CLNTYEKDL3",
};

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

//firebase authenticaiton
const auth = firebase.auth();

//firestore database
const db = firebase.firestore(app);

export { auth, db };

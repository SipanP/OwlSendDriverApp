import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQu9FrMsBabR-gQP1nbOUmI49YNOU9j2s",
  authDomain: "instantdeliveryapp.firebaseapp.com",
  projectId: "instantdeliveryapp",
  storageBucket: "instantdeliveryapp.appspot.com",
  messagingSenderId: "323064584813",
  appId: "1:323064584813:web:770073a68f2912eed7fd64",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

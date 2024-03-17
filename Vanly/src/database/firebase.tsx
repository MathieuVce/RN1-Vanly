import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBvbLkh84kajMIdLZlZe6IoPNNNqjLac3c',
  authDomain: 'vanly-54024.firebaseapp.com',
  projectId: 'vanly-54024',
  storageBucket: 'vanly-54024.appspot.com',
  messagingSenderId: '769618467407',
  appId: '1:769618467407:web:79551b51407c20f37ee83a',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, db, auth };

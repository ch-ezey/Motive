import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {initializeFirestore} from 'firebase/firestore';
import {getStorage, ref} from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  databaseURL: 'https://motive-8c0ca.firebaseio.com',
  apiKey: 'AIzaSyBRUSR7ze-dp7wGaMOw4oeefK9Zh4kCw3w',
  authDomain: 'motive-8c0ca.firebaseapp.com',
  projectId: 'motive-8c0ca',
  storageBucket: 'motive-8c0ca.appspot.com',
  messagingSenderId: '71262665710',
  appId: '1:71262665710:web:cdcaab7c3c4330a7d52cff',
  measurementId: 'G-9FHDS3TKLD',
};

// Initialize Firebase

// const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Create a storage reference from our storage service
const storageRef = ref(storage);

// Return details of the user currently logged in
// const user = auth.currentUser;

export {storageRef, storage, auth, db};

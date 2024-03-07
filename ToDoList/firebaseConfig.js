// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdXaG5fBVAlbgwK5ruiY-rALVTCzhma2s",
  authDomain: "todolist-e16d8.firebaseapp.com",
  projectId: "todolist-e16d8",
  storageBucket: "todolist-e16d8.appspot.com",
  messagingSenderId: "128987463985",
  appId: "1:128987463985:web:e1e6f82fc58468a153f010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    experimentalForceLongPolling:true,
});

export default app
export {db}
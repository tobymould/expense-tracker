import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDxQ1eUZ1hyAa0MS3cBzx_KWnDmeQWBTgM',
  authDomain: 'expense-tracker-223d5.firebaseapp.com',
  databaseURL: 'https://expense-tracker-223d5.firebaseio.com',
  projectId: 'expense-tracker-223d5',
  storageBucket: 'expense-tracker-223d5.appspot.com',
  messagingSenderId: '265597170879',
  appId: '1:265597170879:web:7524374184a3a51576820a',
  measurementId: 'G-HWQ6N8ZMNY'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export const firestore = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();

export default firebase;

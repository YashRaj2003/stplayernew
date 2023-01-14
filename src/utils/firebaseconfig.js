import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAbwE3QSGqg-qunRrN_z2_S4wC4m-tj3D8",
    authDomain: "stplayer-9dffd.firebaseapp.com",
    projectId: "stplayer-9dffd",
    storageBucket: "stplayer-9dffd.appspot.com",
    messagingSenderId: "320285526384",
    appId: "1:320285526384:web:e8661991efd04ec0ee27b5",
    measurementId: "G-3634F111KS"
};
let db;
let auth;
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    db = firebase.firestore();
    auth = firebase.auth()

}
export { db, auth }

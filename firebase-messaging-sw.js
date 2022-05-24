// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDgti7R6tPmNhjOY4Kp_Qt9CBRAgxTWkKM",
    authDomain: "arno-cellarier.firebaseapp.com",
    projectId: "arno-cellarier",
    storageBucket: "arno-cellarier.appspot.com",
    messagingSenderId: "122339573172",
    appId: "1:122339573172:web:d377c096955a56e642c6e1",
    measurementId: "G-G6TCXRC95X"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
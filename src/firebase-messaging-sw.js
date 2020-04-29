importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
  firebase.initializeApp({
    apiKey: "AIzaSyBvhirpICwYGLTWj8ytjv7Kd6u3XurZS8M",
    authDomain: "encontreaki-509b5.firebaseapp.com",
    databaseURL: "https://encontreaki-509b5.firebaseio.com",
    projectId: "encontreaki-509b5",
    storageBucket: "encontreaki-509b5.appspot.com",
    messagingSenderId: "375280335786",
    appId: "1:375280335786:web:d0d62fcacfc2b9d69549d3",
    measurementId: "G-DYJL90M858"
});
  const messaging = firebase.messaging();
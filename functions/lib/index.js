"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weather = require("./weather");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = { apiKey: "AIzaSyA4jNtRhzLZ_i9lXyjjevT1alNPk8u0zeY",
    authDomain: "class-material-reminder.firebaseapp.com",
    databaseURL: "https://class-material-reminder.firebaseio.com",
    projectId: "class-material-reminder",
    storageBucket: "class-material-reminder.appspot.com",
    messagingSenderId: "532659783292" };
admin.initializeApp(config);
let firestore = admin.firestore();
let ws = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy', 'College Station');
exports.addUser = functions.https.onRequest((request, response) => {
    let userData = { fname: request.body.fname, lname: request.body.lname, age: request.body.age, email: request.body.email };
    let docRef = firestore.collection('users').doc(`${userData.fname}`);
    docRef.set(userData)
        .then(ref => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday"];
        for (let x = 0; x < days.length; x++) {
            docRef.collection('schedule').doc(`${days[x]}`).set({
                createdAt: Date.now().toString()
            }).then((reference) => 1).catch(err => { return "Error in making schedule for user" + err; });
        }
        return `User ${userData.fname} ${userData.lname} created!`;
    })
        .then(message => response.send({ status: 1, mess: message }))
        .catch(err => response.status(500).send("ERROR: " + err));
});
//# sourceMappingURL=index.js.map
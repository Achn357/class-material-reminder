import * as weather from './weather'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const config = {apiKey: "AIzaSyA4jNtRhzLZ_i9lXyjjevT1alNPk8u0zeY",
    authDomain: "class-material-reminder.firebaseapp.com",
    databaseURL: "https://class-material-reminder.firebaseio.com",
    projectId: "class-material-reminder",
    storageBucket: "class-material-reminder.appspot.com",
    messagingSenderId: "532659783292"};

admin.initializeApp(config)
let firestore = admin.firestore()

let ws = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy','College Station')

export const addUser = functions.https.onRequest((request,response) =>{
    //I am hard coding data right now for testing purposes, 
    //soon I will make it so that you will have to give credentials in the request
    let userData = {fname:request.body.fname, lname:request.body.lname, age:request.body.age, email: request.body.email}
    let docRef = firestore.collection('users').doc(`${userData.fname}`);

    docRef.set(userData)

    .then(ref => {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday"]
        for(let x =0; x<days.length; x++){
            docRef.collection('schedule').doc(`${days[x]}`).set({
                createdAt: Date.now().toString()
            }).then((reference)=>1).catch(err => { return "Error in making schedule for user" + err})
        }
        return `User ${userData.fname} ${userData.lname} created!`
    })

    .then(message => response.send(message))

    .catch(err => response.status(500).send("ERROR: " + err))

})
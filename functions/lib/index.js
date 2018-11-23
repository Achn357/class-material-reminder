"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const weather = require("./weather");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mergeJSON = require("merge-json");
const calendarAPI = require("./calendar");
//start of initializations
const config = { apiKey: "AIzaSyA4jNtRhzLZ_i9lXyjjevT1alNPk8u0zeY",
    authDomain: "class-material-reminder.firebaseapp.com",
    databaseURL: "https://class-material-reminder.firebaseio.com",
    projectId: "class-material-reminder",
    storageBucket: "class-material-reminder.appspot.com",
    messagingSenderId: "532659783292" };
admin.initializeApp(config);
const firestore = admin.firestore();
//end of initializations
//=============start of helper functions
function generateUserId(id_length, alphabetInclude_flag, capital_letters_flag) {
    let charset = '0123456789';
    if (alphabetInclude_flag !== 0)
        charset += 'abcdefghijklmnopqrstuvwxyz';
    if (capital_letters_flag !== 0)
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0, len = id_length; i < len; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
}
function lastSyncDateTime() {
    const currentdate = new Date();
    const datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}
function change_from_epoch_to_day(epoch) {
    const currentDay = new Date(epoch * 1000);
    const days = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    };
    return days[currentDay.getDay()];
}
exports.change_from_epoch_to_day = change_from_epoch_to_day;
function change_from_epoch_to_hour(epoch) {
    const currentDay = new Date(epoch * 1000);
    //return 24 hour time
    return currentDay.getHours();
}
//==========end of helper functions
//start of user class
class user {
    constructor(uid, locid) {
        this.user_id = "";
        this.location_id = "";
        this.loca = "";
        this.user_id = uid;
        this.location_id = locid;
    }
    set_user_id(id) {
        this.user_id = id;
    }
    set_location_id(id) {
        this.location_id = id;
    }
    set_location(loc) {
        this.loca = loc;
    }
    get_user_id() {
        return this.user_id;
    }
    get_location_id() {
        return this.location_id;
    }
    get_location() {
        return this.loca;
    }
}
exports.user = user;
//=======end of user class
//start of cloud functions
exports.addUser = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    const userData = { fname: request.body.fname, lname: request.body.lname, age: request.body.age, email: request.body.email };
    const userID = generateUserId(10, 1, 1);
    let ws_temp = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy', request.body.location);
    const docRef = firestore.collection('users').doc(`${userID}`);
    yield ws_temp.get_All_Possible_Locations()
        .then(array => {
        ws_temp.set_allLocations(array);
        ws_temp.set_location_key(ws_temp.get_allLocations()[0].locationkey);
        ws_temp.setState(ws_temp.get_allLocations()[0].state);
        ws_temp.setCountry(ws_temp.get_allLocations()[0].country);
        let totaluserdata = mergeJSON.merge(userData, {
            "location": ws_temp.getLocation(),
            "state": ws_temp.getState(),
            "country": ws_temp.getCountry(),
            "locationkey": ws_temp.get_location_key(),
            "user_id": userID,
            "lastSync": lastSyncDateTime()
        });
        docRef.set(totaluserdata)
            .then(ref => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday"];
            for (let x = 0; x < days.length; x++) {
                docRef.collection('schedule').doc(`${days[x]}`).set({
                    createdAt: Date.now().toString()
                }).then((reference) => 1).catch(err => { return "Error in making schedule for user" + err; });
            }
            return `User ${userData.fname} ${userData.lname} created!`;
        })
            .then(message => response.send({
            status: 1,
            message: message
        }))
            .catch(err => response.status(500).send({
            status: 0,
            message: "There was an error in making initial credentials for user",
            errordetails: err
        }));
    });
}));
exports.add_12_Hour_Weather = functions.https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
    let current_user = new user("", "");
    let docRef = firestore.collection('users').doc(`${request.body.userid}`);
    yield docRef.get()
        .then(snapshot => snapshot.data())
        .then(data => {
        current_user.set_user_id(data.user_id);
        current_user.set_location_id(data.locationkey);
        current_user.set_location(data.location);
    })
        .catch(err => response.status(500).send({ status: 0, message: "Error in retrieving user information. Maybe non-existent user id. Error details: " + err }));
    let ws = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy', current_user.get_location());
    yield ws.get_12hour_forecast(current_user.get_location_id())
        .then(data => {
        for (let x = 0; x < data.length; x++) {
            const epochtime = data[x].EpochDateTime;
            const day = change_from_epoch_to_day(epochtime);
            const currenthour = change_from_epoch_to_hour(epochtime);
            const event_id = generateUserId(10, 0, 0);
            docRef.collection('schedule').doc(`${day}`).collection(`${day}`).doc(`${event_id}`).set({
                "id": event_id,
                "name": `${day}'s weather at ${currenthour}`,
                "start": currenthour,
                "finish": currenthour + 1,
                "temperature": data[x].Temperature_Value,
                "units": data[x].Temperature_Units,
                "weathericon": data[x].WeatherIcon,
                "precipitation": data[x].PrecipitationProbability,
                "phrase": data[x].IconPhrase
            })
                .then(r => 1)
                .catch(err => response.status(500).send("Something went wrong with adding hourly data to schedule. Error details: " + err));
        }
        return "Writing 12 hour weather data is finished";
    })
        .then(message => response.send({ status: 1, message: "12 hour Schedule has been created" }))
        .catch(err => response.status(500).send({ status: 0, message: "Could not get 12 hour weather. Something went wrong on Accuweather api. Error details: " + err }));
}));
exports.calendarTest = functions.https.onRequest((request, response) => {
    let cw = new calendarAPI.calendarWrapper();
    cw.initializeAuth();
    cw.intializeToken();
    cw.getEventData().then(data => {
        response.send(JSON.stringify(data));
    }).catch(error => {
        response.status(500).send(error);
    });
});
exports.storeData = functions.https.onRequest((request, response) => {
    if (request.method != 'POST') {
        response.status(400).send('Request made to cloud function "printData" was not a POST request.');
        return;
    }
    let storedData = request.body;
    console.log('request body:');
    console.log(storedData);
    //firestore.collection('users').doc('pp7mMDaHUf').collection('schedule').doc('thisWeeksEvents').set(storeData);
    response.send('data successfully stored');
});
//end of cloud functions
//# sourceMappingURL=index.js.map
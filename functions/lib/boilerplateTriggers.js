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
const env_1 = require("./enviornment/env");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const hp = require("./helperfunctions");
admin.initializeApp(env_1.config);
const firestore = admin.firestore();
exports.addScheduleBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const userID = snap.data().uid;
    const scheduleRef = firestore.collection('schedule').doc(`${userID}`);
    return yield scheduleRef.set({ lastSync: hp.lastSyncDateTime(), "uid": userID })
        .then(ref => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            scheduleRef.collection(`${day}`).doc(`Info`).set({ lastSync: hp.lastSyncDateTime() })
                .catch(err => console.log("Error in making schedule for user" + err));
        });
    });
}));
exports.addMaterialsBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const userID = snap.data().uid;
    const materialsRef = firestore.collection('materials').doc(`${userID}`);
    return yield materialsRef.set({ "lastSync": hp.lastSyncDateTime(), "uid": userID })
        .then(ref => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            materialsRef.collection(`${day}`).doc(`Info`).set({ lastSync: hp.lastSyncDateTime() })
                .catch(err => console.log("Error in making schedule for user" + err));
        });
    });
}));
exports.addWeatherBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    const userID = snap.data().uid;
    const zipcode = snap.data().zipcode;
    const weatherRef = firestore.collection('weather').doc(`${userID}`);
    return yield weatherRef.set({ "locationkey": "", "uid": userID, "lastSync": hp.lastSyncDateTime(), "zipcode": zipcode })
        .then(ref => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(day => {
            weatherRef.collection(`${day}`).doc(`Info`).set({ lastSync: hp.lastSyncDateTime() })
                .catch(err => console.log("Error in making weather template for user" + err));
        });
    }).catch();
}));
//# sourceMappingURL=boilerplateTriggers.js.map
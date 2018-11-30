import * as weather from './weather';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as mergeJSON from 'merge-json';
import * as fetch from 'node-fetch';
import {user} from './user';
import * as hp from './helperfunctions';
import {schemaChecker} from './schema_checker'


  /**
     ========================================================================================================
     ========================================    INITIALIZATIONS     ========================================
     ========================================================================================================
     */
const config = {apiKey: "AIzaSyA4jNtRhzLZ_i9lXyjjevT1alNPk8u0zeY",
    authDomain: "class-material-reminder.firebaseapp.com",
    databaseURL: "https://class-material-reminder.firebaseio.com",
    projectId: "class-material-reminder",
    storageBucket: "class-material-reminder.appspot.com",
    messagingSenderId: "532659783292"
};

admin.initializeApp(config)

const firestore = admin.firestore();

//we will be using realtime to pair oauth ids with user ids



  /**
     ========================================================================================================
     =========================================   CLOUD FUNCTIONS    =========================================
     ========================================================================================================
     */


export const addUser = functions.https.onRequest(async (request,response) =>{
    const correct_schema = {fname:"",lname:"",age:"",email:"",location:""};
    let sch = new schemaChecker(correct_schema);
    const check = sch.compare_schema(request.body)
    
    if(check.length == 0){
        const userData = {fname:request.body.fname, lname:request.body.lname, age:request.body.age, email: request.body.email}
        const userID = hp.generateUserId(10,1,1)
        let ws_temp = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy',request.body.location)
    
    
        const docRef = firestore.collection('users').doc(`${userID}`);
        
        await ws_temp.get_All_Possible_Locations()
        .then(async (array) =>{
            ws_temp.set_allLocations(array)
            ws_temp.set_location_key(ws_temp.get_allLocations()[0].locationkey)
            ws_temp.setState(ws_temp.get_allLocations()[0].state)
            ws_temp.setCountry(ws_temp.get_allLocations()[0].country)
    
            await ws_temp.get_specific_location_info(ws_temp.get_location_key())
                
            
            let totaluserdata = mergeJSON.merge(userData,
                {
                    "location": ws_temp.getLocation(),
                    "state":ws_temp.getState(), 
                    "country":ws_temp.getCountry(),
                    "locationkey":ws_temp.get_location_key(),
                    "user_id": userID,
                    "lastSync": hp.lastSyncDateTime(),
                    "latitude":ws_temp.get_latitude(),
                    "longitude":ws_temp.get_longitude(),
                    "gmtoffset":ws_temp.get_gmtoffset()
                }
                )
           
            
            docRef.set(totaluserdata)
    
            .then(ref => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday"]
                for(let x =0; x<days.length; x++){
                    docRef.collection('schedule').doc(`${days[x]}`).set({
                        createdAt: Date.now().toString()
                    }).then((reference)=>1).catch(err => { return "Error in making schedule for user" + err})
    
                    docRef.collection('materials').doc(`${days[x]}`).set({
                        createdAt: Date.now().toString()
                    }).then((reference)=>1).catch(err => { return "Error in making materials for user" + err})
                }
                return `User ${userData.fname} ${userData.lname} created!`
            })
        
            .then(message => response.send(
                {
                    status: 1,
                    message:message,
                    userid: userID
                }
            ))
        
            .catch(err => response.status(500).send(
                {
                    status:0,
                    message:"There was an error in making initial credentials for user",
                    errordetails: err
                }
            ))
    
    
        })
    }else{
        let totalstring ="";
        check.forEach(element => {
            totalstring += element + ","
        });
        response.status(501).send({status:0,message:totalstring + "is missing from the request body"})
    }
    
    
})

export const add_12_Hour_Weather = functions.https.onRequest(async(request,response)=>{
    if(request.body.hasOwnProperty('userid')){
        let current_user = new user("","");
        const docRef = firestore.collection('users').doc(`${request.body.userid}`);
    
        await docRef.get()
        .then(snapshot => snapshot.data())
        .then(data => {
            current_user.set_user_id(data.user_id);
            current_user.set_location_id(data.locationkey);
            current_user.set_location(data.location);
            current_user.set_gmtoffset(data.gmtoffset);
        })
        .catch(err => response.status(500).send({status: 0, message:  "Error in retrieving user information. Maybe non-existent user id. Error details: " + err}))
    
        
        let ws = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy',current_user.get_location())
    
        await ws.get_12hour_forecast(current_user.get_location_id())
        .then(data =>{
            data.forEach(element =>{
                const epochtime=hp.adjust_Epoch_To_Time_Zone(element.EpochDateTime,current_user.get_gmtoffset());
                const day = hp.change_from_epoch_to_day(epochtime);
                const currenthour = hp.change_from_epoch_to_hour(epochtime);
                const event_id = hp.generateUserId(10,1,1);
    
                docRef.collection('schedule').doc(`${day}`).collection(`weather`).doc(`${event_id}`).set({
                    "id":event_id,
                    "epoch":epochtime,
                    "day":day,
                    "name":`${day}'s weather at ${currenthour}`,
                    "start":currenthour,
                    "finish":currenthour+1,
                    "temperature":element.Temperature_Value,
                    "units":element.Temperature_Units,
                    "weathericon":element.WeatherIcon,
                    "precipitation":element.PrecipitationProbability,
                    "phrase":element.IconPhrase,
                    "notification_message":hp.useWeatherCode(parseInt(data.IconPhrase))
                })
                .then(r =>1)
                .catch(err => response.status(500).send("Something went wrong with adding hourly data to schedule. Error details: " + err))
    
            })
            
            return "Writing 12 hour weather data is finished";
            
        })
        .then(message => response.send({status:1, message: "12 hour Schedule has been created"}))
        .catch(err => response.status(500).send({status:0,message:"Could not get 12 hour weather. Something went wrong on Accuweather api. Error details: "+ err}))
    
    }else{
        response.status(501).send({status:0,message:"Please send a userid in the response body"})
    }

})

export const add_current_weather = functions.https.onRequest(async (request,response) =>{
    if(request.body.hasOwnProperty('userid')){
        let current_user = new user("","");
        let docRef = firestore.collection('users').doc(`${request.body.userid}`);
    
        await docRef.get()
        .then(snapshot => snapshot.data())
        .then(data => {
            current_user.set_user_id(data.user_id);
            current_user.set_location_id(data.locationkey);
            current_user.set_location(data.location);
            current_user.set_gmtoffset(data.gmtoffset);
    
        })
        .catch(err => response.status(500).send({status: 0, message:  "Error in retrieving user information. Maybe non-existent user id. Error details: " + err}))
    
        
        let ws = new weather.weatherScanner('HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy',current_user.get_location());
        ws.set_location_key(current_user.get_location_id());
        
    
        await ws.get_current_conditions(ws.get_location_key())
        .then(data =>{
            const epochtime = hp.adjust_Epoch_To_Time_Zone(data.EpochDateTime,current_user.get_gmtoffset());
            const day = hp.change_from_epoch_to_day(epochtime)
            const currenthour = hp.change_from_epoch_to_hour(epochtime);
            const eventid = hp.generateUserId(10,1,1);
    
    
            docRef.collection('schedule').doc(`${day}`).collection(`weather`).doc(`${eventid}`).set({
                "id":eventid,
                "epoch":epochtime,
                "day":day,
                "name":`${day}'s weather at ${currenthour}`,
                "start":currenthour,
                "finish":currenthour+1,
                "temperature":data.Temperature_Value,
                "units":data.Temperature_Units,
                "weathericon":data.WeatherIcon,
                "phrase":data.IconPhrase,
                "notification_message":hp.useWeatherCode(data.IconPhrase)
            })
            .then(refe => 1)
            .catch(err => response.status(500).send("Something went wrong in adding the data to user"))
        })
        .then(mssg => response.send({status:1,message:"Current hour is added to the schedule"}))
        .catch(err => response.status(500).send({status:0,message:"Could not get 12 hour weather. Something went wrong on Accuweather api. Error details: "+ err}))
    
    }else{
        response.send({status:0,message:"Please send a userid in the response body"})
    }
    
})

export const sayHello = functions.https.onRequest(async (request,response) =>{
    const d = new Date();

    firestore.collection('hellotesting').doc('hello').update({
        message:"hello world",
        time:`synced on ${d.getMonth()}/${d.getDay()}/${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`
    }).then(ref => response.send(`hello at synced on ${d.getMonth()}/${d.getDay()}/${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`))
    .catch(err => response.status(500).send(""+err))
})

export const firstcronjob = functions.pubsub.topic('sayinghello').onPublish(async message =>{
    //adds 12 hoour weather for every user every 12 hours

    //collecting all ids
    
    await fetch('https://us-central1-class-material-reminder.cloudfunctions.net/sayHello')
    .then(response => {
        console.log(response.json());
        return response.json();
    })
    .catch(err => console.log(err));


}) 

export const addGoogleCalendarData = functions.https.onRequest(async (req,res) =>{
    if(req.body.hasOwnProperty('userid')){
        const docRef = firestore.collection('users').doc(`${req.body.userid}`).collection('schedule');
        let temp_user = new user('','')
    
        //getting user's gmt offset. we will later use this to get user's email, their auth tokens etc. 
        //Another cloud function will be made to update those settings
    
        await firestore.collection('users').doc(`${req.body.userid}`).get()
            .then(snapshot =>snapshot.data())
            .then(data => {
                temp_user.set_user_id(data.user_id);
                temp_user.set_gmtoffset(data.gmtoffset);
            }).catch(err => res.status(500).send({status:0,message:"Something went fron in getting user credentials" + err}))
    
    
        fetch('https://us-central1-class-material-reminder.cloudfunctions.net/calendarTest')
        .then(response => response.json())
        .then(data =>{
    
            const array = data.events;
            array.forEach(element => {
                const start_epoch = hp.adjust_Epoch_To_Time_Zone(element.starttime/1000, temp_user.get_gmtoffset());
                const end_epoch = hp.adjust_Epoch_To_Time_Zone(element.endtime/1000, temp_user.get_gmtoffset());
                const name = element.eventname;
                const id = hp.generateUserId(10,0,0);
                const day = hp.change_from_epoch_to_day(hp.adjust_Epoch_To_Time_Zone(element.starttime/1000, temp_user.get_gmtoffset()))
    
                docRef.doc(`${day}`).collection('class').doc(`${id}`).set({
                    name:name,
                    start:{
                        start_hour:hp.change_from_epoch_to_hour(start_epoch),
                        start_time_decimal:hp.change_time_to_decimal(hp.change_from_epoch_to_hour(start_epoch), hp.get_hanging_minutes_of_epoch(start_epoch)),
                        start_time_normal:hp.change_from_epoch_to_hour(start_epoch)+":"+hp.get_hanging_minutes_of_epoch(start_epoch)
                    },
                    end:{
                        end_hour:hp.change_from_epoch_to_hour(end_epoch),
                        end_time_decimal:hp.change_time_to_decimal(hp.change_from_epoch_to_hour(end_epoch),hp.get_hanging_minutes_of_epoch(end_epoch)),
                        end_time_normal:hp.change_from_epoch_to_hour(end_epoch)+":"+hp.get_hanging_minutes_of_epoch(end_epoch)
                    },
                    id: id
                })
                    .then(ref =>1)
                    .catch(err => res.send({status:0,message:"Error in adding data to firestore. Error details: "+ err}));
    
            });
            return {status:1,message:"Finished writing google calendar events to firestore"}
        })
        .then(mssg => res.send(mssg))
        .catch(err => res.status(500).send({status:0,message:"Something went wrong in fetching the schedule data cloud function. Error details: " + err}))
    }else{
        res.send({status:0,message:"Please send userid in request body"})
    }
    
})


/* export const getadduserids = functions.https.onRequest(async (request,response)=>{
    firestore.
}) */
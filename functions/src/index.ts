import {config} from './enviornment/env'
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as hp from './helperfunctions';
import {schemaChecker} from './schema_checker';
import * as fetch from 'node-fetch';

admin.initializeApp(config)
const firestore = admin.firestore();

class User {
  private locationkey;
  private gmtoffset;
  public getLocationKey():string{
    return this.locationkey;
  }
  public setLocationKey(loc:string):void{
    this.locationkey = loc;
  }
  public getGmtOffset():string{
    return this.gmtoffset;
  }
  public setGmtOffset(gmt:string):void{
    this.gmtoffset = gmt;
  }
}

export const addUser = functions.runWith({memory:'1GB'}).https.onRequest(async(request,response) => {
  const correct_schema = {firstname:"",lastname:"",location:"", zipcode:"", email:""};
  const sch = new schemaChecker(correct_schema);
  const check = sch.compare_schema(request.body)
  
  if(check.length > 0){
      let totalstring ="";
      const ele:string[] = [];
      check.forEach(element => {totalstring += element + ","; ele.push(element)});
      response.status(501).send({status:0,message:totalstring + "is missing from the request body", elements:ele});
  }

  const userID = hp.generateUserId(10,1,1);
  const userData = {
                      firstname:request.body.firstname, 
                      lastname:request.body.lastname, 
                      location: request.body.location, 
                      email:request.body.email, 
                      zipcode: request.body.zipcode, 
                      uid:userID,
                      dateCreated: hp.lastSyncDateTime()
                  };
  
  return await firestore.collection('users').doc(`${userID}`).set(userData)
  .then(data => response.send(
      {
          status: 1,
          message:`User ${userData.firstname} ${userData.lastname} created!`,
          userid: userID
      }
  ))
  .catch(err => response.status(500).send(
      {
          status:0,
          message:"There was an error in making initial credentials for user",
          errordetails: err
      }
  ));
     
})

export const addScheduleBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate(async (snap,context) => {

        const userID = snap.data().uid;
        const scheduleRef = firestore.collection('schedule').doc(`${userID}`);

        return await scheduleRef.set({lastSync: hp.lastSyncDateTime(),"uid":userID})
                    .then(ref => {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        days.forEach(day => {
                            scheduleRef.collection(`${day}`).doc(`Info`).set({lastSync: hp.lastSyncDateTime()})
                            .catch(err => console.log("Error in making schedule for user" + err))
                        });
                    });

       
})

export const addMaterialsBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate(async (snap,context) => {

        const userID = snap.data().uid;
        const materialsRef = firestore.collection('materials').doc(`${userID}`);

        return await materialsRef.set({"lastSync": hp.lastSyncDateTime(),"uid":userID})
                    .then(ref => {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        days.forEach(day => {
                            materialsRef.collection(`${day}`).doc(`Info`).set({lastSync: hp.lastSyncDateTime()})
                            .catch(err => console.log("Error in making schedule for user" + err))
                        });
                    });
})

export const addWeatherBoilerPlate = functions.firestore
    .document('users/{uid}')
    .onCreate(async (snap,context) => {

        const userID = snap.data().uid;
        const zipcode = snap.data().zipcode;

        const weatherRef = firestore.collection('weather').doc(`${userID}`);

        return await weatherRef.set({"locationkey":"","uid":userID,"lastSync": hp.lastSyncDateTime(), "zipcode":zipcode})
                    .then(ref => {
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        days.forEach(day => {
                            weatherRef.collection(`${day}`).doc(`Info`).set({lastSync: hp.lastSyncDateTime()})
                            .catch(err => console.log("Error in making weather template for user" + err))
                        });
                    }).catch();
})

export const add12weather = functions.runWith({memory:'2GB'}).firestore
    .document('weather/{uid}')
    .onCreate(async (snap,context) => {
      
      const zipcode = snap.data().zipcode;
      const uid = snap.data().uid;
      const url = `http://dataservice.accuweather.com/locations/v1/postalcodes/US/search?apikey=HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy&q=${zipcode}`
      const user = new User();
      await fetch(url).then(data => data.json()).then(data => {user.setLocationKey(data[0].Key); user.setGmtOffset(data[0].TimeZone.GmtOffset)})
      
      
      const a =  firestore.collection('weather').doc(uid)
            .update({locationkey:user.getLocationKey(),gmtOffset:user.getGmtOffset()})
            .catch(err => console.log(err))

      const b = fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${user.getLocationKey()}?apikey=HGJe79DbnxNn9DRNEDiH19CNYBXg0Tdy`)
      .then(response => response.json())
      .then(json => {
          const forecasts_12hour: Array<any> = [];
          for (const i of json) {
              forecasts_12hour.push({
                  DateTime: i.DateTime + "",
                  EpochDateTime: i.EpochDateTime + "",
                  WeatherIcon: i.WeatherIcon + "",
                  IconPhrase: i.IconPhrase + "",
                  Temperature_Value: i.Temperature.Value + "",
                  Temperature_Units: i.Temperature.Unit + "",
                  PrecipitationProbability: i.PrecipitationProbability + ""
              });
          }
          for(const x of forecasts_12hour){
              const epochtime:number = hp.adjust_Epoch_To_Time_Zone(x.EpochDateTime,user.getGmtOffset());
              const day = hp.change_from_epoch_to_day(epochtime);
              const currenthour = hp.change_from_epoch_to_hour(epochtime);
              const event_id = hp.generateUserId(10,1,1);
  
              firestore.collection('weather').doc(uid).collection(`${day}`).doc(`${event_id}`).set({
                  id:event_id,
                  epoch:epochtime,
                  day:day,
                  name:`${day}'s weather at ${currenthour}`,
                  start:currenthour,
                  finish:currenthour+1,
                  temperature:x.Temperature_Value,
                  units:x.Temperature_Units,
                  weathericon:x.WeatherIcon,
                  precipitation:x.PrecipitationProbability,
                  phrase:x.IconPhrase
              })
              .catch(err => console.log("Something went wrong with adding hourly data to schedule. Error details: " + err))
          }
      })
      .catch(err => console.log('Oops something went wrong with fetching weather' + err))

      return Promise.all([a,b]).catch(err => console.log('Oops something went wrong in promise.all' + err))
})


export const deleteUser = functions.https.onRequest((req,res) => {
  const uid = req.body.uid
  firestore.collection('users').doc(uid).delete()
  .then(ref => {
      res.send({status:1, message: `UserID: ${uid} deleted`, uid: uid})
  })
  .catch(err => {
      res.status(501).send({status:0, message: `Unable to delete UserID: ${uid}`, uid: uid, error:err})
  })
})

export const deleteUserMaterials = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  }).firestore
    .document('users/{uid}')
    .onDelete(async (snap,context) => {
        const uid = snap.data().uid;
        return firestore.collection('materials').doc(uid).delete()
                .catch(err => console.log(err))
    })


export const deleteUserSchedule = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  }).firestore
.document('users/{uid}')
.onDelete(async (snap,context) => {
    const uid = snap.data().uid;
    return firestore.collection('schedule').doc(uid).delete()
            .catch(err => console.log(err))
})


    
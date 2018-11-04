1) In your shell(terminal/command prompt) `cd` into a any directory of your choice (Desktop, Documents, Pictures ...)
Ex. ` cd /Users/Gowtham/Desktop/ `. 

2) Clone this repo. 
`git clone https://github.com/SundarGowtham/class-material-reminder.git`

2) `cd` into the folder you just downloaded
Ex. ` cd class-material-reminder `

3) When you are in the file, you will need to `cd` into the functions folder. 
Eg. `cd functions`

4) Then type in `npm install`. This will install all the dependancies for node into a folder called 'node_modules'

5) The main files are in the 'src' folder (this is in the functions folder). 


Assignments: 

**1) Make a static function that converts an epoch time to a specific day**

Epoch time is a format of reporting dates. Epoch time is in seconds from the year 1970

Accuweather uses this so I want to be able to change this into a day

ex. of epoch time: 1541096520 (this is an integer)
from this I want a specific day like Monday, Tuesday, Wednesday ...

```
function change_from_epoch_to_day(time){
../code/..
}
```

**2) A cloud function that gets back schedule data from firebase database**

So in the database under each user, there is a collection called --schedule-- . This is the schedule data for each user. 
Your task is to make a cloud function that gets this data
EG.
```
export const get_schedule_from_database(function(request, response){
../code/ ..
})
```

**3) Change how we add a user to our database**

So currently as you can see in the code below, I am hard coding user data. We want to automize this. 
Currenty I have: 

```
export const addUser = functions.https.onRequest((request,response) =>{
    //I am hard coding data right now for testing purposes, 
    //soon I will make it so that you will have to give credentials in the request
    const userData = {fname:"Gowtham",lname:"Sundar", age:19, email: "gowthamraagul@gmail.com"}
    const docRef = firestore.collection('users').doc(`${userData.fname}`);

    docRef.set(userData)

```

Look closely at 'userData'

```
const userData = {fname:"Gowtham",lname:"Sundar", age:19, email: "gowthamraagul@gmail.com"}
```
In real life we won't have this. Instead we should put this in the body of the request for each user

Look into [request.body](https://cloud.google.com/functions/docs/writing/http) 


*** Next Round of Assignments ***

-Adding Weather data to the corresponding day
-Integrating google calendar api
-Adding google calendar data to firebase



**EXPLANATION OF CLOUD FUNCTIONS**

*What are cloud functions:-*
Cloud functions are a way for us to interact with firebase. The advantange of cloud functions is that we are making our javascript code into its own api service -- which means when we write our cloud function in javascript and deploy it to firebase, the firebase cli gives us an url. 

That url is called a REST ENDPOINT. A REST endpoint is a way for others to access our api/services.

***IMPORTANT NOTE:  ALL CLOUD FUNCTIONS AND FIREBASE FUNCTIONALITY IS PROMISE BASED WHICH MEANS TRADITIONAL NODE.JS FUNCTIONALTY WON'T WORK WELL WITH THIS. More of this will be explained later***

*Types of cloud functions:-*

**Type** | **Uses Promises** | **Can you make REST endpoint with this?** | **Can I access firebase services with this directly?**
--- | --- | --- | ---
*HTTPS* | No | Yes | No
*Background* | Yes | No | Yes

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

**2) A cloud function that gets back data from firebase database **

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
const userData = {fname:"Gowtham",lname:"Sundar", age:19, email: "gowthamraagul@gmail.com"}
```
In real life we won't have this. Instead we should put this in the body of the request for each user

```
export const addUser = functions.https.onRequest((request,response) =>{
    //I am hard coding data right now for testing purposes, 
    //soon I will make it so that you will have to give credentials in the request
    const userData = {fname:"Gowtham",lname:"Sundar", age:19, email: "gowthamraagul@gmail.com"}
    const docRef = firestore.collection('users').doc(`${userData.fname}`);

    docRef.set(userData)

```



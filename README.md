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


=======================================================================================================================================

**EXPLANATION OF CLOUD FUNCTIONS**

*What are cloud functions:-*
Cloud functions are a way for us to interact with firebase. The advantange of cloud functions is that we are making our javascript code into its own api service -- which means when we write our cloud function in javascript and deploy it to firebase, the firebase cli gives us an url. 

That url is called a REST ENDPOINT. A REST endpoint is a way for others to access our api/services.

***IMPORTANT NOTE:  ALL CLOUD FUNCTIONS AND FIREBASE FUNCTIONALITY IS PROMISE BASED WHICH MEANS TRADITIONAL NODE.JS FUNCTIONALTY WON'T WORK WELL WITH THIS. More of this will be explained later***

*Types of cloud functions:-*

**Type** | **Uses Promises** | **Can you make REST endpoint with this?** | **Can I access firebase services with this directly?**
--- | --- | --- | ---
*HTTPS* | Yes | Yes | No
*Background* | Yes | No | Yes

===
-HTTPS functions allow us to make REST endpoints. They take in a request and emit a response once it is done with it's purpose. It has n direct connection with firebase's services like firestore database, storage, hosting, or any gcp services. 

Https cloud functions serves as a wrapper to all of our code so that anyone who calls on these urls can execute our logic.

- Background functions are cloud functions that all us to access firebase's services and use them. Background functions allow us to use Firestore, Storage, Authentication, Machine Learning Kit and all of GCP's services and much more. In real life we will be using both HTTPS and Background Cloud functions combined to really serve our needs. 

====
How are https cloud functions structured?

With every http cloud function, it has to take in a request(this can be empty) and send a response back to the caller. Here is an example. 
```
import * as functions from 'firebase-functions'

export const sayHello = functions.https.onRequest(function(request, response){
    response.send("Hello World");
})
```

In this example it shows the basic way to make a HTTP cloud function. Now this one isn't very useful but it does illustrate its bare nature. 

In order to make a ***HTTPS cloud function***, we have to export it. The name of the function will be what you name the variable, in this case I called mine ``` sayHello ```.

The next part is ```function.https.OnRequest()```

This is basically a way for us to call the functions object and tell it that we are making a HTTPS cloud function. You will pretty much do this for all https cloud functions.

Notice the callback function in ```function.https.OnRequest ...```

it looks like this ```function(request, response){
    response.send("Hello World");
}  ```

Inside this is where we actually start our logic. We are taking in a **request** and a **response**. Both of them are objects. For now, do not worry about where they came from, just know that they are available to us. 

The request is the data that the user is giving. If this is a **POST** request, then we will be expecting data from the user to be stored in the **request** object. If this is a GET request, then you don't need to bother with it.

Now the **response** is very important. This is the data you give back to the user. Now with HTTPS cloud functions **YOU ALWAYS NEED TO SEND A RESPONSE BACK TO THE USER**. It doesn't matter if it is actual data, or a error message, you have to make sure you let the user know what actually happened

But **why** do we need to send a response? Well firstly cloud function won't even work if you don't send back data. Secondly in the industry, not sending back a response is the equivalent of being left on read. You don't want that, your clients don't want that. We need to know if our function actually did what it was supposed to do. If something went wrong then it should tell us.

Now, how do we send back a response?

We do it with ```response.send()```.

the **.send()** method is the equivalent of the **return** keyword in regular functions. When the cloud function executes
```response.send() ```, it knows it is safe to terminate. 

===
How are Background functions structured? 

To understand background functions, you will first need to understand how promises work

***remember when I said cloud functions are promise based. Here is the explanation***

Promises are basically a way for us to deal with the difficulty of **TIME**. Promises let us exceute different tasks at the same time or different times. Promises are extremely useful when it comes to dealing with the web. Think of the HTTP protocol and the USPS. Requests and Responses happen at so many different times all over the place and HTTP is responsible for handling those events.

Now if person A made a request at time 1, and person B made a request at time 2. Lets say that person 1 ordered a helicopter,
while person 2 only order a pencil. A helicopter takes so much time to go get, package, and ship back, while a usb charger only
takes roughly one day to fully package and ship back. We don't want to slow down all operations of all shipping and orders 
just so that person A will get their helicopter first and then person B will get their pencil after. There is a better way to do this. 

How about we let all shipping and orders happen all at the same time so that order that take only 1 day to finish can get their order 
shipped and done with so that tasks can be done faster. If we wait for things to only happen one by one, the postal service would be 
incredibly slow( cough.. cough ..not that it is exactly fast these days). The same thing goes with the web. If the web waited for 
everything to happen one by one then all of our favorite sites like twitter or youtube will take sooooo long to load and get going. 
Doing many tasks all at the same time is called **Asynchronous**

Promises let us to execute code at the same time or different times(with async await which we learned) in order for us to actually have a fast application. 

Now back to background cloud functions. Google made all of their node.js services promise based so that we can make use of the asynchronous nature of node.js. When dealing with promises we always have to handle for successes and errors. 

we do this with **.then() and .catch()**

**.then** let's us take the success data and so something with it. **.catch** lets us catch any errors


====
**NOV 11/2018**
Assignments:
-cron job/google pub sub
-fcm(firebase cloud messaging)
-notification system(a class in our files that will automatically know when to notify the person)
-google calendar(integration)
-front end(this is for later)

Cron Job(Gowtham):
a scheduled time for a cloud function to trigger

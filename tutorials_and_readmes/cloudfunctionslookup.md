This is a documentation of all of our cloud functions:
Response schema- When we are making cloud functions let us all follow this format
```
{
status:
message:
}
```
*status:* can be 0 or 1.   
0 means failure  
1 means success  

*message:* a sample message to let client know about the operation  

# REST ENDPOINTS
========================================================================================
## Add User

**Type:** POST  
**Payload:**
```
{
"fname": "Johnny",
"lname": "AppleSeed",
"age": "18",
"email": "some_email@email.com"
}
```
**Response:**  
A success message looks like this:  
```
{
"status":1,
"message":"User Johnny AppleSeed successfully created"
}
```
A failure message looks like this:  
```
{
"status":0,
"message":"Unable to create user Johnny Appleseed"
}
```

**Function:** To add a user to our database  
**REST ENDPOINT:**  ``` https://us-central1-class-material-reminder.cloudfunctions.net/addUser ```    

========================================================================================

## Add 12 Hour Weather to User

**Type:** POST  
**Payload:**
```
{
	"userid":"WMLlAHKkmf"
}
```
**Response:**  
A success message looks like this:  
```
{
status:1, 
message: "12 hour Schedule has been created"
}
```
A sample failure message looks like this:  
```
{
status:0,
message:"Could not get 12 hour weather. Something went wrong on Accuweather api."
}
```

**Function:** To add 12 hour weather to user's schedule  
**REST ENDPOINT:**  ``` https://us-central1-class-material-reminder.cloudfunctions.net/add_12_Hour_Weather ```  

========================================================================================

## Add Current Weather to User

**Type:** POST  
**Payload:**
```
{
	"userid":"WMLlAHKkmf"
}
```
**Response:**  
A success message looks like this:  
```
{
	status:1,
	message:"Current hour is added to the schedule"

}
```
A sample failure message looks like this:  
```
{
	status:0,
	message:"Something went wrong in adding the data to user"
}
```

**Function:** To add current weather to user's schedule  
**REST ENDPOINT:**  ``` https://us-central1-class-material-reminder.cloudfunctions.net/add_current_weather ```  

========================================================================================

## Calendar Test

**Type:** GET  
**Payload:**

In it's final form this function will accept a user id, but right now it does not.

**Response:**  
A success message looks like this:  
```
{
status: 1,
message: 'data for next week successfully acquired',
weekEvents: weekEvents
}
```
A sample failure message looks like this:  
```
{
status:0,
message:"CSomething went wrong in fetching the data from the google calendar api."
}
```

**Function:** To obtain the events on a user's calendar within the next week 
**REST ENDPOINT:**  ``` https://us-central1-class-material-reminder.cloudfunctions.net/calendarTest ```  

========================================================================================

## addGoogleCalendarData

**Type:** POST  
**Payload:**

{
	"userid":"DR9bT69MpW"
}

**Response:**  
A success message looks like this:  
```
{
	status:1,
	message:"Finished writing google calendar events to firestore"
}
```
A sample failure message looks like this:  
```
{
	status:0,
	message:"Something went wrong in fetching the schedule data cloud function."
}
```
However, the current form of the function does not allow for a failure message to be sent.

**Function:** To obtain the events on a user's calendar within the next week 
**REST ENDPOINT:**  ``` https://us-central1-class-material-reminder.cloudfunctions.net/addGoogleCalendarData ```  


# BACKGROUND FUNCTIONS
========================================================================================

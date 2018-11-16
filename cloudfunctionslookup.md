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

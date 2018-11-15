This is a documentation of all of our cloud functions:

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
**REST ENDPOINT: ** ``` https://us-central1-class-material-reminder.cloudfunctions.net/addUser ```  

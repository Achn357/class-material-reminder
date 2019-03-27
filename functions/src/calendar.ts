var google = require('googleapis').google;
// Imports the Google Cloud client library
var vision = require('@google-cloud/vision');

//This file contains a function for parsing events from a calendar image using the Google Cloud Vision API. It also contains several helper functions


//a helper function to check the next day while keeping a variable on the current day
function incrementDay(day){
  switch(day)
  {
  case "Monday": return "Tuesday";
  case "Tuesday": return "Wednesday";
  case "Wednesday": return "Thursday";
  case "Thursday": return "Friday";
  case "Friday": return "Saturday";
  case "Saturday": return "Sunday";
  default: return "";
  }
}

//a helper function to restructure the event data after it has been acquired from the API
function restructure(dayParse, day){
  let numEvents = Math.floor((dayParse[day].length)/9) + Math.ceil(((dayParse[day].length)%9)/9); //Based on ideal cropping and sizing, each event should have 8 or 9 text variables
  let numCells = dayParse[day].length;

  let newFormat = [];

  for(let i = 0; i<numEvents; i++) //For each event
  {
    let tempObject = {
      "className": "",
      "fiveDigitCode": "",
      "classType": "",
      "time": "",
      "location": ""
    };

    for(let j = 0; j < 9; j++) //move the text variables into tempObject
    {
      numCells--;
      let words = dayParse[day][j + 9*i];
      if(numCells >= 0)
      {
        switch(j)
          {
            case 0:
            case 1:
              tempObject["className"] = tempObject["className"] + words;
              break;
            case 2:
              tempObject["fiveDigitCode"] = words;
              break;
            case 3:
              tempObject["classType"] = words;
              break;
            case 4:
            case 5:
            case 6:
              tempObject["time"] = tempObject["time"] + words;
              break;
            case 7:
            case 8:
              tempObject["location"] = tempObject["location"] + words;
              break;
          }
      }
    }
    newFormat.push(tempObject); //add the events to one array
  }

  dayParse[day] = newFormat; //at the end of the function, dayParse should be restructured for the day on which it is called
}

//this is the main funcction of this file. It accepts an image and a callback, and passes parsed and restructured event data to the callback
export async function detectText(imgLocation ,callback) {
    // Creates a client with authentication - needs the ID and the location of the credentials file
    const client = new vision.ImageAnnotatorClient({
      "type": "service_account",
"project_id": "class-material-reminder",
"private_key_id": "a550bef6df24939ee07359b9bf87e182f5092aae",
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDE6GyMzBNfZYL+\nKwjLr2xxXyIa5lS6HUVZxTVswlYh5DWiANbfo5uVo+DGUz5LG7l2x2EAxf1ARlXD\nwP98R3cxFQhonkYxKPrgUN+VH4ipDn8nJU95Jyi96CXuL1hbGNQskb1VsfeFnJKH\nbsKpNyA9JUWX3GFmcJcz/Su+yqDTCFifkwS6Ghzj2BseRpgFoSjdT0rfT/fP8BKm\nQG0EUOF2CGKWzKYooqibO7QkHU8SeYlCBkEZL5JGcsPjlTnEz+iWGRk5sz033GCf\nfWKVdl6uRBdBUAa1IO8tgOiQUgHtmaJu+qtUxkJPlAbmwgRoVTqIefA9MvYGnySg\ng060TJ0PAgMBAAECggEAAo3JKqJS9f/JDSbdvFaQH4BOXu7x1mAe0CVApiJ3H4Vo\nNKuyHcBveidf+PKHck3vv9yiI3Jt8HF5F0rfhWsf3qEZNNIosuaHKnWiELsR+K9Z\nctaHC1k4rA3gwBAZI0VVKybQv9XJEhCPzfXfzHYMkv5ywp93G+8F5wS3lofmQhZp\nwLOG2qmKJdeTOEL10k4fPw/R7/rqegY8XrrhUT2mQsL2uKd67cdOnbsgh9ZwCyZh\ny9awdi24jIbHW+sBXgbTesKz/lFWyW17CfTc9SZQna8EulZSh7Je9CUr7aD5vKY9\n/brwGu9Yv9r19BFtr+n/wnXG7omnSr6lsarvNek7MQKBgQD/I2irfv1D1YUsAhKF\ne6OLHFBt1FQVv9C8SIFQNUQv6ZwoK2j3THF8MULBYNd2AQd3ZvF+HeY7bjH0ISFJ\nIgS6RBmj0748xiAJbwHf1ykpiKtA6gwbq2nbP2tIS16sE1JFH6z/TM+Q9ud/28r/\n41xGW0I6259EK2XRohmUVl11mwKBgQDFkqtiz8Z3qTZNupFpf8SHHDtmcIZJYm4g\nd0VsSG8G9Xc57qRCqOvItoxyK8pmvsuJDiKGfCKRzQLNviBtnVBzHO+SAPZ543/2\n+4FCSaoKYVcOjcNbEeBxvdvHLmQqmKDsE2QCNLPtODvx86jJFaG1/vnZbXKd29g2\nlp54dLDHnQKBgA+vYJbydqV98fLzqanVIQfDVNp7rDOuGCoLFxAURj3f0b7SdGCH\nrY5iBOWYi4Zwp8HabUxAkE/lBWMpyj8RvVKqLx1YPiDEWWHbFjVpp9kq0sRp3xaw\nYhCdhH3sTESt52fie6MyWKxj0XWV0JQMqTaWE6tEpzTsqhTKL2JkMNizAoGBAJ5k\nIzooUHgGFB7kf0cQw0F+BLDvbPjQDHHCrMlOmJP/ngG3q8A1JDHZB2dQbAdK1mme\nB1fBlQVGUgUXc2/tOl3OyNFILFEzbZdXshyuab/AocZtKDyObF1DVDqummb7zab1\nNKwADG8VMhmauanbybTaIPuKnuSnJwM8ZPc0tbSRAoGBAIEN/RqssBDgh6eIH08v\n1H1SNGjQF8vraLVAaDCeqdS5eIkyjvgp/gdgI/cwdjsTBAKtzOLb6KsPrmCQfTYK\nBxKirhbmf+eMSswx+Dhv7OwPr2myZs93IBCKbGzHF9Y4cfb4AW9izZYPAiLIdXyF\nWBmIEA4Wm8qaYV9FYMZwp/9U\n-----END PRIVATE KEY-----\n",
"client_email": "cloudvision@class-material-reminder.iam.gserviceaccount.com",
"client_id": "100416393697249203467",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/cloudvision%40class-material-reminder.iam.gserviceaccount.com"
  });
  
    // Performs text detection on the image file
    const [result] = await client.textDetection(imgLocation);

    //a variable for checking the bounds of an event - helps detect what day it occurs
    let dayBounds = {
      "Monday": [0, 0],
      "Tuesday": [0, 0],
      "Wednesday": [0, 0],
      "Thursday": [0, 0],
      "Friday": [0, 0],
      "Saturday": [0, 0],
      "Sunday": [0, 0]
    };

    //a variable for collecting initial event data
    let dayParse = {
      "Monday": [],
      "Tuesday": [],
      "Wednesday": [],
      "Thursday": [],
      "Friday": [],
      "Saturday": [],
      "Sunday": []
    };

    //a variable to ensure that information seen before weekdays are seen is ignored
    let weekDaysSeen = false;

    const text = result.textAnnotations;
    text.forEach(text => {
      
      if(dayBounds.hasOwnProperty(text.description)) //If the text seen is a weekday
      {
        weekDaysSeen = true; //we have now seen a wekkday

        //set bounds of weekday text within dayBounds
        dayBounds[text.description][0] = Math.min(text.boundingPoly.vertices[0].x, text.boundingPoly.vertices[3].x);
        dayBounds[text.description][1] = Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x);
      }
      else //If the text is not a weekday
      {
        for(var day in dayBounds){ //See which day the event occurs by checking which day's bound it falls under
            if(weekDaysSeen && day === "Sunday" && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) > dayBounds[day][0]) //Sunday requires special check
            {
              if(text.boundingPoly.vertices[1].y > 10) //an edge case check
              {
                dayParse[day].push(text.description);
              }
            }
            //any day but Sunday
            else if(weekDaysSeen && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) > dayBounds[day][0] && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) < dayBounds[incrementDay(day)][0])
              {
                dayParse[day].push(text.description);
              }
        }
      }


    });

    for (var key in dayParse) //call restructure on each day in dayParse
    {
      restructure(dayParse, key);
    }
    //console.log(dayParse);
    callback(dayParse)
  }
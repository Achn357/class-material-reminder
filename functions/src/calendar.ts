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
  case "Sunday": return "";
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
      projectId: 'class-material-reminder',
      keyFilename: 'https://firebasestorage.googleapis.com/v0/b/class-material-reminder.appspot.com/o/cmr_credentials.json?alt=media&token=b20e25ea-720a-4962-9778-e6088afd9e73'
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
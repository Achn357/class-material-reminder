var google = require('googleapis').google;
// Imports the Google Cloud client library
var vision = require('@google-cloud/vision');

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

function restructure(dayParse, day){
  let numEvents = Math.floor((dayParse[day].length)/9) + Math.ceil(((dayParse[day].length)%9)/9);
  let numCells = dayParse[day].length;

  let newFormat = [];

  for(let i = 0; i<numEvents; i++)
  {
    let tempObject = {
      "className": "",
      "fiveDigitCode": "",
      "classType": "",
      "time": "",
      "location": ""
    };

    for(let j = 0; j < 9; j++)
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
    newFormat.push(tempObject);
    // for(let j = 0; j < 9; j++)
    // {
    //   words = dayParse[day][j*i];
    //     if(words.includes(":") && words.includes("-"))
    //       tempObject["time"] = tempObject["time"] + words;
    //     else if(words.includes(":"))
    //       tempObject["time"] = words + tempObject["time"];
    //     else if(words.includes("-"))
    //       tempObject["className"] = tempObject["className"] + words;
    // }
  }

  dayParse[day] = newFormat;
}

async function detectText() {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs text detection on the image file
    const [result] = await client.textDetection('calendar.png');

    let dayBounds = {
      "Monday": [0, 0],
      "Tuesday": [0, 0],
      "Wednesday": [0, 0],
      "Thursday": [0, 0],
      "Friday": [0, 0],
      "Saturday": [0, 0],
      "Sunday": [0, 0]
    };

    let dayParse = {
      "Monday": [],
      "Tuesday": [],
      "Wednesday": [],
      "Thursday": [],
      "Friday": [],
      "Saturday": [],
      "Sunday": []
    };

    let weekDaysSeen = false;

    const text = result.textAnnotations;
    console.log(text[9].boundingPoly);
    console.log('Text:');
    text.forEach(text => {
      
      //console.log(text.description);
      //console.log(text.boundingPoly.vertices);
      if(dayBounds.hasOwnProperty(text.description))
      {
        weekDaysSeen = true;
        dayBounds[text.description][0] = Math.min(text.boundingPoly.vertices[0].x, text.boundingPoly.vertices[3].x);
        dayBounds[text.description][1] = Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x);
      }
      else
      {
        //console.log(dayBounds);
        console.log(text.description);
        //console.log(text.boundingPoly);
        for(var day in dayBounds){
          //console.log(dayBounds[day][0]);
          //console.log(dayBounds[day][1]);
            if(weekDaysSeen && day === "Sunday" && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) > dayBounds[day][0])
            {
              if(text.boundingPoly.vertices[1].y > 10)
              {
                dayParse[day].push(text.description);
              }
            }
            else if(weekDaysSeen && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) > dayBounds[day][0] && Math.max(text.boundingPoly.vertices[1].x, text.boundingPoly.vertices[2].x) < dayBounds[incrementDay(day)][0])
              {
                dayParse[day].push(text.description);
              }
        }
      }


    });

    console.log(dayParse);
    for (var key in dayParse)
    {
      restructure(dayParse, key);
    }
    console.log(dayParse);
  }


detectText();
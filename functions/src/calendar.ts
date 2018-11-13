const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    //console.log(content);
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), getEventData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  let oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Get the events within the next week on the users primary calendar and put the events into an object.
 * Returns an object containing an array with each event stored as an element of the array.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getEventData(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  let week_epoch = 604800000; //amount of milliseconds in a week
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()),
    timeMax: new Date((new Date().getTime() + week_epoch)),
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    let nextWeekEvents = {
      events: [] 
    };
    if(events.length) {
      events.map((event, i) => {
        let currentEvent = {};
        if(event.start.dateTime == undefined)
        {
          var start = new Date(event.start.date);
          var end = new Date(event.end.date);
        }
        else
        {
          var start = new Date(event.start.dateTime);
          var end = new Date(event.end.dateTime);
        }

        currentEvent['eventname'] = event.summary;
        currentEvent['startdate'] = start;
        currentEvent['longstartdate'] = `${start}`;
        currentEvent['starttime'] = currentEvent['startdate'].getTime();
        currentEvent['enddate'] = end;
        currentEvent['longenddate'] = `${end}`;
        currentEvent['endtime'] = currentEvent['enddate'].getTime();

        nextWeekEvents.events.push(currentEvent);
      })
    } else {
      console.log("No upcoming events found.");
    }
    console.log(nextWeekEvents);
  });
}
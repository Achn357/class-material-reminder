"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
class calendarWrapper {
    constructor(token) {
        // Load client secrets from a local file.
        // fs.readFile('credentials.json', (err, content) => {
        //   if (err) { 
        //   console.log('Error loading client secret file:', err);
        //   return
        //   }
        //   this.credentials = JSON.parse(content);
        // });
        this.SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
        this.TOKEN_PATH = 'token.json';
        //the above code can be used when we have access to an actual credentials file
        const credentials = {
            installed: {
                client_id: "532659783292-tf0bihp5niek445hd027k5hc9e5erh2j.apps.googleusercontent.com",
                project_id: "class-material-reminder",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://www.googleapis.com/oauth2/v3/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_secret: "rtv_xaFFveJRZb6sA5-_Lomp",
                redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
            }
        };
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        //  let token = {
        //   access_token:"ya29.GltOBubQheiuALvYOlrNwPTrbCZM7WGr-krvJdB2eI4aAXjX79OynwJQ7kpceR75FAbzl_wehmHHMqEMsgpvUdGrL3uogzEyyw_c1ahPNQCNU9jy9SsAU3UR_bm4",
        //   refresh_token:"1/6q88FVUIf6h2vMIkhOqzokrUeLX_TAAqZAFYbqYkl4s",
        //   scope:"https://www.googleapis.com/auth/calendar.readonly",
        //   token_type:"Bearer",
        //   expiry_date:1541652007014};
        oAuth2Client.setCredentials(token);
        this.authorization = oAuth2Client;
    }
    //   public initializeAuth() {
    //     const {client_secret, client_id, redirect_uris} = this.credentials.installed;
    //    let oAuth2Client = new google.auth.OAuth2(
    //        client_id, client_secret, redirect_uris[0]);
    //        this.authorization = oAuth2Client;
    //  }
    /**
   * Create an OAuth2 client with credentials, and then execute the
   * given callback function.
   * @param {function} callback The callback to call with the authorized client.
   */
    // public intializeToken() {
    //   // Check if we have previously stored a token.
    //   // fs.readFile(this.TOKEN_PATH, (err, token) => {
    //   //   if (err) {
    //   //     this.getAccessToken(oAuth2Client, callback);
    //   //     return;
    //   //   }
    //   //});
    //   let token = {
    //     access_token:"ya29.GltOBubQheiuALvYOlrNwPTrbCZM7WGr-krvJdB2eI4aAXjX79OynwJQ7kpceR75FAbzl_wehmHHMqEMsgpvUdGrL3uogzEyyw_c1ahPNQCNU9jy9SsAU3UR_bm4",
    //     refresh_token:"1/6q88FVUIf6h2vMIkhOqzokrUeLX_TAAqZAFYbqYkl4s",
    //     scope:"https://www.googleapis.com/auth/calendar.readonly",
    //     token_type:"Bearer",
    //     expiry_date:1541652007014};
    //     this.authorization.setCredentials(token);
    // }
    //IGNORE THIS FUNCTION FOR NOW. IT IS A CARRY OVER FROM A PREVIOUS IMPLEMENTATION OF THIS FILE.
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     */
    getAccessToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    console.error('Error retrieving access token', err);
                    return;
                }
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err2) => {
                    if (err2)
                        console.error(err2);
                    console.log('Token stored to', this.TOKEN_PATH);
                });
            });
        });
    }
    getNextWeekEventData(callback) {
        let auth = this.authorization;
        const calendar = google.calendar({ version: 'v3', auth });
        const week_epoch = 604800000; //amount of milliseconds in a week
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()),
            timeMax: new Date((new Date().getTime() + week_epoch)),
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (callback) {
                callback(err, res);
            }
        });
    }
}
exports.calendarWrapper = calendarWrapper;
//# sourceMappingURL=calendar.js.map
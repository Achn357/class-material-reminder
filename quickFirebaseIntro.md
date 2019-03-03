So to interact with firebase programmatically we have to install the `firebase-admin` library.    
I know I told you to make a folder and initialize a firebase project called `firebase init`.    
But that is for later. For now what you should so is the following:   
## Setup
1) Make a new folder   
2) `cd` into that folder in command line(CMD on Windows or Terminal on Mac)
3) Again in the command line, type in `npm init -y`   
4) Next type in `npm -g typescript`
5) In the folder make a new file called `tsconfig.json` and paste the following into that file:   
```
{
    "compilerOptions": {
      "lib": ["es6"],
      "module": "commonjs",
      "noImplicitReturns": true,
      "sourceMap": true,
      "target": "es6"
    },
    "compileOnSave": true,
}
  
```   
6) Next in the command line type in `npm install firebase-admin`   
7) In the folder make a new file called `index.ts`   
8) The **index.ts** will be our main file we write our code on. Okay remember the **firebase-admin** module we just installed.    
Now we need to import it. To do that lets start with writing this piece of code:   
`import * as admin from "firebase-admin"`   
    
Basically the `*` means everything, the `as admin` means whatever you are importing give it the name of `admin`.   
Finally the `from firebase-admin` lets node know which module we are talking about.    
So to put it all together we are basically saying **import everything from firebase-admin with the name of admin**   
9) Next we need the credentials to hook up to our firebase project. Go to your firebase project and you will see the homepage.    
Now on the top left you will see a settings wheel. Click it and then go to project settings. Scroll all the way to the bottom   
where you will see `There are no apps for your project`. Beside that message are 4 icons. Click the 3rd one from the left(the icon looks like this `</>`). A pop up will appear and you will see a bit of code. In the code is a variable called `config`. It will look like this:   
```
var config = {
    apiKey: "AXXXXXXXXXXXXXXX",
    authDomain: "AXXXXXXXXXXXXXXX",
    databaseURL: "AXXXXXXXXXXXXXXX",
    projectId: "AXXXXXXXXXXXXXXX",
    storageBucket: "AXXXXXXXXXXXXXXX",
    messagingSenderId: "AXXXXXXXXXXXXXXX"
  };
```   
Copy just that part and paste it into `index.ts`   
10) While you are on the firebase console, on the left-hand bar click database. Then click `Create Database`. After a while a dialog box
should pop up asking to start the database in `locked mode` or `test mode`. Click `test mode`. 
11) Back in `index.ts` we need to initialize `admin` with that `config`. To do that type this in: `admin.initializeApp(config)`. 
12) Next let us make a database variable called `firestore` and set it equal to `admin.firestore()`. The code should look like this:   
`const firestore = admin.firestore();`   
13) Finally lets write something to our database. Firestore works by a system called collections and documents. Collections are like folders and documents are like inividual files. Each file has information in it. Paste the following code in :   
```
const data = {state:"Illinois",country:"United States of America",gdp:"800 Billion"};
firestore.collection('cities').doc('Chicago').set(data)
```   
Basically I have a bunch of data and I want to add that to my database. So in my `cities` **collection** in the `Chicago` **document** I write information stored in the variable called `data`. **By the way** if a collection or document doesn't exist in the Firestore database, it will automatically make those collections or documents. So basically I am making a new **collection** called `cities` and a new **document** called `Chicago` and I am writing data to it.   

14) Now lets run code. In your command line -- **MAKE SURE YOU ARE IN THE FOLDER YOU PUT INDEX.TS IN. If not 'cd' into it** -- type in `tsc`. This will compile our *tyepscript* file into a *javascript* file. Then type in `node inedx.js`.   
15) Go to the firebase console. Then click on database on the left sidebar and then you will see the data you just added. Feel free to add more data of your choice. Try experimenting

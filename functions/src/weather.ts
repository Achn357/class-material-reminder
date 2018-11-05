import * as fetch from 'node-fetch'

export function conv_to_query(strToConvert:string): string{
    let newstr:string = ""
    for (let i:number=0; i< strToConvert.length; i++){
      if(strToConvert[i] === " "){
        newstr += "+"
      }else{
        newstr+=strToConvert[i]
      }
    }
    return newstr;
}

//This function accepts an epoch time number and returns the current day of the week (Monday. Tuesday, etc.)
export function change_from_epoch_to_day(epoch:number):string{
    let currentDay = new Date(epoch*1000);

    var days = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    return days[currentDay.getDay()];
}

//This function accepts an inconNumber as input and returns a string containing advice on what weather-related items to take
export function useWeatherCode(iconNumber){
    if(iconNumber < 1 || iconNumber > 44)
       return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
   
    if(iconNumber <= 5)
       return 'No percipitation in sight! Feel free to leave the house without an umbrella.';
   
    if(iconNumber <= 8)
       return 'It is cloudy but percipitation is not in the forecast. You do not need to take an unbrella but be mindful of the weather.';
       
    if(iconNumber == 9 || iconNumber == 10)
       return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
   
    if(iconNumber == 11)
       return 'Percipitation is not necessarily predicted but fog is. Use your best judgement regarding the weather.';
   
    if(iconNumber <= 18)
       return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
   
    if(iconNumber <= 23)
       return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
   
    if(iconNumber <= 25)
       return 'Ice or sleet are in the forecast. Grab a rain/snow jacket and an umbrella. If too much is coming down, stay indoors for your own safety.';
   
    if(iconNumber == 26)
       return 'Freezing rain alert! Grab a rain/snow jacket and an umbrella before you leave the house.';
   
    if(iconNumber == 27 || iconNumber == 28)
       return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
   
    if(iconNumber == 29)
       return 'Rain and snow are in the forecast. Grab a rain/snow jacket and an umbrella before you leave the house.';
   
    if(iconNumber == 30)
       return 'It is forecast to be very hot in the near future. Dress lightly and drink lots of fluids!';
   
    if(iconNumber == 31)
       return 'It is forecast  to be very cold in the near future. Dress heavily and stay warm!';
   
    if(iconNumber == 32)
       return 'It is forecast to be windy, but that is all. Consider dressing heavier as wind usually feels cold.';
   
    if(iconNumber <= 37)
       return 'No percipitation in sight! Feel free to leave the house without an umbrella.';
   
    if(iconNumber == 38)
       return 'It is cloudy but percipitation is not in the forecast. You do not need to take an unbrella but be mindful of the weather.';
   
    if(iconNumber <= 42)
       return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
   
    return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
   }

   //This class is a wrapper class for obtaining weather information with the AccuWeather API
export class weatherScanner{
    private readonly weatherapikey:string;
    private location:string;
    private location_key:string = "";

    constructor(apikey:string, location:string){
        this.weatherapikey = apikey;
        this.location = conv_to_query(location);
    }
    public changelocation (newlocation:string):void{
        this.location = conv_to_query(newlocation);
    }

    private location_search_endpoint: string = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    private get_12_hour_forecast_endpoint:string= 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
    private get_current_conditions_endpoint:string = 'http://dataservice.accuweather.com/currentconditions/v1/';
    
    public getLocation():string{
        return this.location
    }

    //This function accepts a string as input, and returns an array containing pertinent data for each possible location found using the input string
    public async get_All_Possible_Locations(){
        return await fetch(`${this.location_search_endpoint}?apikey=${this.weatherapikey}&q=${this.location}`)
        .then(response => response.json())
        .then((json)=>{
            let finalobject:Array<Object> = [];
            for (let x=0; x<json.length; x++){
                let locationinfo = {
                    locationkey:"",
                    name:"",
                    state:"",
                    country:"",
                    lat:"",
                    lng:""};

                locationinfo.locationkey = json[x].Key;
                locationinfo.name = json[x].EnglishName;
                locationinfo.country = json[x].Country.EnglishName;
                locationinfo.state = json[x].AdministrativeArea.EnglishName;
                locationinfo.lat = json[x].GeoPosition.Latitude;
                locationinfo.lng = json[x].GeoPosition.Longitude;
                
                finalobject.push(locationinfo)
            }
            return finalobject
        })
    }
    public set_location_key(key):void{
        this.location_key = key;
    }
    public get_location_key():string{
        return this.location_key
    }

        //this function accepts a location key and returns an array of length 12 containing weather forecast information on the location for each of the next 12 hours
    public async get_12hour_forecast(locationkey:string){
            return fetch(`${this.get_12_hour_forecast_endpoint}/${locationkey}?apikey=${this.weatherapikey}`)
            .then(response => response.json())
            .then(json => {
                let forecasts_12hour:Array<Object> = [];

                for (let i=0; i< json.length; i++){
                    let cleanedupjson = {
                        DateTime: "",
                        EpochDateTime: 0,
                        WeatherIcon: 0,
                        IconPhrase: "",
                        Temperature_Value: 0,
                        Temperature_Units: "F",
                        PrecipitationProbability: 0
                    };

                    cleanedupjson.DateTime = json[i].DateTime;
                    cleanedupjson.EpochDateTime = json[i].EpochDateTime;
                    cleanedupjson.WeatherIcon = json[i].WeatherIcon;
                    cleanedupjson.IconPhrase = json[i].IconPhrase;
                    cleanedupjson.Temperature_Value = json[i].Temperature.Value;
                    cleanedupjson.Temperature_Units = json[i].Temperature.Unit;
                    cleanedupjson.PrecipitationProbability = json[i].PrecipitationProbability;
                    forecasts_12hour.push(cleanedupjson);
                }
            })
            .catch(err => console.log('Oops something went wrong' + err))
    }

    //this function accepts a location key as input and returns a JSON object containing the current weather conditions for the given location
    public async get_current_conditions(locationkey:string){
        return fetch(`${this.get_current_conditions_endpoint}/${this.location_key}?apikey=${this.weatherapikey}`)
        .then(response => response.json())
            .then(json => {
                
                    return  {
                        DateTime: json[0].DateTime,
                        EpochDateTime: json[0].EpochDateTime,
                        WeatherIcon: json[0].WeatherIcon,
                        IconPhrase: json[0].IconPhrase,
                        Temperature_Value: json[0].Temperature.Value,
                        Temperature_Units: json[0].Temperature.Unit,
                        PrecipitationProbability: json[0].PrecipitationProbability
                        }
            
                    })
            .catch(err => console.log('Oops something went wrong' + err))
    }
}


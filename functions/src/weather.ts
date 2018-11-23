import * as fetch from 'node-fetch';
import * as hp from './helperfunctions';




   //This class is a wrapper class for obtaining weather information with the AccuWeather API
export class weatherScanner{
    private readonly weatherapikey:string;
    private location:string;
    private location_key:string = "";
    private alllocations_tmp = [];
    private state:string = "";
    private country:string = "";
    private latitude=0;
    private longitude = 0;
    private gmtoffset = 0;


    constructor(apikey:string, location:string){
        this.weatherapikey = apikey;
        this.location = hp.conv_to_query(location);
    }
    public changelocation (newlocation:string):void{
        this.location = hp.conv_to_query(newlocation);
    }

    

    private location_search_endpoint: string = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    private get_12_hour_forecast_endpoint:string= 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour';
    private get_current_conditions_endpoint:string = 'http://dataservice.accuweather.com/currentconditions/v1';
    private get_specific_location_info_endpoint:string = "http://dataservice.accuweather.com/locations/v1";
    
    /**
     ========================================================================================================
     =================================   PROMISE BASED FUNCTIONS BELOW    ===================================
     ========================================================================================================
     */

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

    public async get_specific_location_info(lockey){
        await fetch(`${this.get_specific_location_info_endpoint}/${lockey}?apikey=${this.weatherapikey}`)
        .then(data => data.json())
        .then(newdata => {
            
            let json = {
                name:newdata.LocalizedName,
                timezone:newdata.TimeZone.Code,
                gmtoffset: newdata.TimeZone.GmtOffset,
                latitude:newdata.GeoPosition.Latitude,
                longitude:newdata.GeoPosition.Longitude,
                elevation:newdata.GeoPosition.Elevation.Metric.Value,
                elevation_units:newdata.GeoPosition.Elevation.Metric.Unit
            };
            this.set_latitude(json.latitude);
            this.set_longitude(json.longitude);
            this.set_gmtoffset(json.gmtoffset);

            return json;
        })
        .catch(err => {
            return {
                status:0,
                message:"There was an error in fetching specific location data from accuweather" + err
            }
        })
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
                    cleanedupjson.IconPhrase =  json[i].IconPhrase;
                    cleanedupjson.WeatherIcon =  json[i].WeatherIcon;
                    cleanedupjson.Temperature_Value =  json[i].Temperature.Value;
                    cleanedupjson.Temperature_Units =  json[i].Temperature.Unit;
                    cleanedupjson.PrecipitationProbability = json[i].PrecipitationProbability;

                    
                    forecasts_12hour.push(cleanedupjson);
                }

                return forecasts_12hour;
            })  
            .catch(err => console.log('Oops something went wrong' + err))
    }

    //this function accepts a location key as input and returns a JSON object containing the current weather conditions for the given location
    public async get_current_conditions(locationkey:string){
        return fetch(`${this.get_current_conditions_endpoint}/${locationkey}?apikey=${this.weatherapikey}`)
        .then(response => response.json())
        .then(json => {

            try{
                return  {
                    DateTime: json[0].LocalObservationDateTime,
                    EpochDateTime: json[0].EpochTime,
                    IconPhrase: json[0].WeatherText,
                    WeatherIcon: json[0].WeatherIcon,
                    Temperature_Value: json[0].Temperature.Imperial.Value,
                    Temperature_Units: json[0].Temperature.Imperial.Unit
                    }
            }
            catch(e){
                return {message:'Oops something went wrong when formatting accuweather data' + e};
            }
    
        })
        .catch(err => {return "Something went wrong in getting the current conditions with accuweather api. Error details: " + err})
    }


   /**
     ========================================================================================================
     =======================================   GETTERS AND SETTERS    =======================================
     ========================================================================================================
     */

    
    public get_location_key():string{
        return this.location_key
    }
    public getLocation():string{
        return this.location
    }
    public getState():string{
        return this.state;
    }
    public getCountry():string{
        return this.country;
    }
    public get_allLocations(){
        return this.alllocations_tmp;
    }
    public get_longitude(){
        return this.longitude;
    }
    public get_latitude(){
        return this.latitude;
    }
    public get_gmtoffset(){
        return this.gmtoffset;
    }


    public set_location_key(key):void{
        this.location_key = key;
    }
    public setState(state):void{
        this.state = state;
    }
    public setCountry(country):void{
        this.country = country;
    }
    public set_allLocations(allloc):void{
        this.alllocations_tmp = allloc;
    }
    public set_longitude(long):void{
        this.longitude = long;
    }
    public set_latitude(lat):void{
        this.latitude = lat;
    }
    public set_gmtoffset(off):void{
        this.gmtoffset = off;
    }
    
}

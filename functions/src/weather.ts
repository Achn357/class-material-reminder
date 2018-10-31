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

export function convert_epoch_to_day(epoch:number):number{
    let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    return d.setUTCSeconds(epoch);
}


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


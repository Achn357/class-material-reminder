"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("node-fetch");
const hp = require("./helperfunctions");
//This class is a wrapper class for obtaining weather information with the AccuWeather API
class weatherScanner {
    constructor(apikey, location) {
        this.location_key = "";
        this.alllocations_tmp = [];
        this.state = "";
        this.country = "";
        this.latitude = 0;
        this.longitude = 0;
        this.gmtoffset = 0;
        this.location_search_endpoint = 'http://dataservice.accuweather.com/locations/v1/cities/search';
        this.get_12_hour_forecast_endpoint = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour';
        this.get_current_conditions_endpoint = 'http://dataservice.accuweather.com/currentconditions/v1';
        this.get_specific_location_info_endpoint = "http://dataservice.accuweather.com/locations/v1";
        this.weatherapikey = apikey;
        this.location = hp.conv_to_query(location);
    }
    changelocation(newlocation) {
        this.location = hp.conv_to_query(newlocation);
    }
    /**
     ========================================================================================================
     =================================   PROMISE BASED FUNCTIONS BELOW    ===================================
     ========================================================================================================
     */
    //This function accepts a string as input, and returns an array containing pertinent data for each possible location found using the input string
    get_All_Possible_Locations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`${this.location_search_endpoint}?apikey=${this.weatherapikey}&q=${this.location}`)
                .then(response => response.json())
                .then((json) => {
                let finalobject = [];
                for (let x = 0; x < json.length; x++) {
                    let locationinfo = {
                        locationkey: "",
                        name: "",
                        state: "",
                        country: "",
                        lat: "",
                        lng: ""
                    };
                    locationinfo.locationkey = json[x].Key;
                    locationinfo.name = json[x].EnglishName;
                    locationinfo.country = json[x].Country.EnglishName;
                    locationinfo.state = json[x].AdministrativeArea.EnglishName;
                    locationinfo.lat = json[x].GeoPosition.Latitude;
                    locationinfo.lng = json[x].GeoPosition.Longitude;
                    finalobject.push(locationinfo);
                }
                return finalobject;
            });
        });
    }
    get_specific_location_info(lockey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this.get_specific_location_info_endpoint}/${lockey}?apikey=${this.weatherapikey}`)
                .then(data => data.json())
                .then(newdata => {
                let json = {
                    name: newdata.LocalizedName,
                    timezone: newdata.TimeZone.Code,
                    gmtoffset: newdata.TimeZone.GmtOffset,
                    latitude: newdata.GeoPosition.Latitude,
                    longitude: newdata.GeoPosition.Longitude,
                    elevation: newdata.GeoPosition.Elevation.Metric.Value,
                    elevation_units: newdata.GeoPosition.Elevation.Metric.Unit
                };
                this.set_latitude(json.latitude);
                this.set_longitude(json.longitude);
                this.set_gmtoffset(json.gmtoffset);
                return json;
            })
                .catch(err => {
                return {
                    status: 0,
                    message: "There was an error in fetching specific location data from accuweather" + err
                };
            });
        });
    }
    //this function accepts a location key and returns an array of length 12 containing weather forecast information on the location for each of the next 12 hours
    get_12hour_forecast(locationkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`${this.get_12_hour_forecast_endpoint}/${locationkey}?apikey=${this.weatherapikey}`)
                .then(response => response.json())
                .then(json => {
                let forecasts_12hour = [];
                for (let i = 0; i < json.length; i++) {
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
                    cleanedupjson.IconPhrase = json[i].IconPhrase;
                    cleanedupjson.WeatherIcon = json[i].WeatherIcon;
                    cleanedupjson.Temperature_Value = json[i].Temperature.Value;
                    cleanedupjson.Temperature_Units = json[i].Temperature.Unit;
                    cleanedupjson.PrecipitationProbability = json[i].PrecipitationProbability;
                    forecasts_12hour.push(cleanedupjson);
                }
                return forecasts_12hour;
            })
                .catch(err => console.log('Oops something went wrong' + err));
        });
    }
    //this function accepts a location key as input and returns a JSON object containing the current weather conditions for the given location
    get_current_conditions(locationkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`${this.get_current_conditions_endpoint}/${locationkey}?apikey=${this.weatherapikey}`)
                .then(response => response.json())
                .then(json => {
                try {
                    return {
                        DateTime: json[0].LocalObservationDateTime,
                        EpochDateTime: json[0].EpochTime,
                        IconPhrase: json[0].WeatherText,
                        WeatherIcon: json[0].WeatherIcon,
                        Temperature_Value: json[0].Temperature.Imperial.Value,
                        Temperature_Units: json[0].Temperature.Imperial.Unit
                    };
                }
                catch (e) {
                    return { message: 'Oops something went wrong when formatting accuweather data' + e };
                }
            })
                .catch(err => { return "Something went wrong in getting the current conditions with accuweather api. Error details: " + err; });
        });
    }
    /**
      ========================================================================================================
      =======================================   GETTERS AND SETTERS    =======================================
      ========================================================================================================
      */
    get_location_key() {
        return this.location_key;
    }
    getLocation() {
        return this.location;
    }
    getState() {
        return this.state;
    }
    getCountry() {
        return this.country;
    }
    get_allLocations() {
        return this.alllocations_tmp;
    }
    get_longitude() {
        return this.longitude;
    }
    get_latitude() {
        return this.latitude;
    }
    get_gmtoffset() {
        return this.gmtoffset;
    }
    set_location_key(key) {
        this.location_key = key;
    }
    setState(state) {
        this.state = state;
    }
    setCountry(country) {
        this.country = country;
    }
    set_allLocations(allloc) {
        this.alllocations_tmp = allloc;
    }
    set_longitude(long) {
        this.longitude = long;
    }
    set_latitude(lat) {
        this.latitude = lat;
    }
    set_gmtoffset(off) {
        this.gmtoffset = off;
    }
}
exports.weatherScanner = weatherScanner;
//# sourceMappingURL=weather.js.map
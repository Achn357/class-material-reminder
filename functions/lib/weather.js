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
function conv_to_query(strToConvert) {
    let newstr = "";
    for (let i = 0; i < strToConvert.length; i++) {
        if (strToConvert[i] === " ") {
            newstr += "+";
        }
        else {
            newstr += strToConvert[i];
        }
    }
    return newstr;
}
exports.conv_to_query = conv_to_query;
//This function accepts an epoch time number and returns the current day of the week (Monday. Tuesday, etc.)
function change_from_epoch_to_day(epoch) {
    const currentDay = new Date(epoch * 1000);
    const days = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    };
    return days[currentDay.getDay()];
}
exports.change_from_epoch_to_day = change_from_epoch_to_day;
//This function accepts an inconNumber as input and returns a string containing advice on what weather-related items to take
function useWeatherCode(iconNumber) {
    if (iconNumber < 1 || iconNumber > 44)
        return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
    if (iconNumber <= 5)
        return 'No percipitation in sight! Feel free to leave the house without an umbrella.';
    if (iconNumber <= 8)
        return 'It is cloudy but percipitation is not in the forecast. You do not need to take an unbrella but be mindful of the weather.';
    if (iconNumber === 9 || iconNumber === 10)
        return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
    if (iconNumber === 11)
        return 'Percipitation is not necessarily predicted but fog is. Use your best judgement regarding the weather.';
    if (iconNumber <= 18)
        return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
    if (iconNumber <= 23)
        return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
    if (iconNumber <= 25)
        return 'Ice or sleet are in the forecast. Grab a rain/snow jacket and an umbrella. If too much is coming down, stay indoors for your own safety.';
    if (iconNumber === 26)
        return 'Freezing rain alert! Grab a rain/snow jacket and an umbrella before you leave the house.';
    if (iconNumber === 27 || iconNumber === 28)
        return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
    if (iconNumber === 29)
        return 'Rain and snow are in the forecast. Grab a rain/snow jacket and an umbrella before you leave the house.';
    if (iconNumber === 30)
        return 'It is forecast to be very hot in the near future. Dress lightly and drink lots of fluids!';
    if (iconNumber === 31)
        return 'It is forecast  to be very cold in the near future. Dress heavily and stay warm!';
    if (iconNumber === 32)
        return 'It is forecast to be windy, but that is all. Consider dressing heavier as wind usually feels cold.';
    if (iconNumber <= 37)
        return 'No percipitation in sight! Feel free to leave the house without an umbrella.';
    if (iconNumber === 38)
        return 'It is cloudy but percipitation is not in the forecast. You do not need to take an unbrella but be mindful of the weather.';
    if (iconNumber <= 42)
        return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
    return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
}
exports.useWeatherCode = useWeatherCode;
//This class is a wrapper class for obtaining weather information with the AccuWeather API
class weatherScanner {
    constructor(apikey, location) {
        this.location_key = "";
        this.alllocations_tmp = [];
        this.state = "";
        this.country = "";
        this.location_search_endpoint = 'http://dataservice.accuweather.com/locations/v1/cities/search';
        this.get_12_hour_forecast_endpoint = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
        this.get_current_conditions_endpoint = 'http://dataservice.accuweather.com/currentconditions/v1/';
        this.weatherapikey = apikey;
        this.location = conv_to_query(location);
    }
    changelocation(newlocation) {
        this.location = conv_to_query(newlocation);
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
    setState(state) {
        this.state = state;
    }
    setCountry(country) {
        this.country = country;
    }
    set_allLocations(allloc) {
        this.alllocations_tmp = allloc;
    }
    get_allLocations() {
        return this.alllocations_tmp;
    }
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
    set_location_key(key) {
        this.location_key = key;
    }
    get_location_key() {
        return this.location_key;
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
                    cleanedupjson.WeatherIcon = json[i].WeatherIcon;
                    cleanedupjson.IconPhrase = json[i].IconPhrase;
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
            return fetch(`${this.get_current_conditions_endpoint}/${this.location_key}?apikey=${this.weatherapikey}`)
                .then(response => response.json())
                .then(json => {
                return {
                    DateTime: json[0].DateTime,
                    EpochDateTime: json[0].EpochDateTime,
                    WeatherIcon: json[0].WeatherIcon,
                    IconPhrase: json[0].IconPhrase,
                    Temperature_Value: json[0].Temperature.Value,
                    Temperature_Units: json[0].Temperature.Unit,
                    PrecipitationProbability: json[0].PrecipitationProbability
                };
            })
                .catch(err => console.log('Oops something went wrong' + err));
        });
    }
}
exports.weatherScanner = weatherScanner;
//# sourceMappingURL=weather.js.map
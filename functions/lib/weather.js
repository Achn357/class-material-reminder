"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class is a wrapper class for obtaining weather information with the AccuWeather API
class weather {
    setWeatherArray(data) {
        this.weatherArray = data;
    }
    getWeatherArray() {
        return this.weatherArray;
    }
}
exports.weather = weather;
//# sourceMappingURL=weather.js.map
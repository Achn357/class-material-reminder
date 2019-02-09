   //This class is a wrapper class for obtaining weather information with the AccuWeather API
export class weather{
    public weatherArray:Object[];

    public setWeatherArray(data){
        this.weatherArray = data;
    }

    public getWeatherArray(){
        return this.weatherArray;
    }
}

/**
     ========================================================================================================
     ========================================   HELPER FUNCTIONS    =========================================
     ========================================================================================================
*/

export function conv_to_query(str:string){
   return str.replace(/ /g,'+')
}
export function change_from_epoch_to_hour(epoch:number){
    const currentDay = new Date(epoch*1000);
    //return 24 hour time
    return currentDay.getHours()
}
//This function accepts an epoch time number and returns the current day of the week (Monday. Tuesday, etc.)
export function change_from_epoch_to_day(epoch:number){
    const currentDay = new Date(epoch*1000);

    const days = {
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
       
    if(iconNumber === 9 || iconNumber === 10)
       return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
   
    if(iconNumber === 11)
       return 'Percipitation is not necessarily predicted but fog is. Use your best judgement regarding the weather.';
   
    if(iconNumber <= 18)
       return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
   
    if(iconNumber <= 23)
       return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
   
    if(iconNumber <= 25)
       return 'Ice or sleet are in the forecast. Grab a rain/snow jacket and an umbrella. If too much is coming down, stay indoors for your own safety.';
   
    if(iconNumber === 26)
       return 'Freezing rain alert! Grab a rain/snow jacket and an umbrella before you leave the house.';
   
    if(iconNumber === 27 || iconNumber === 28)
       return 'this iconNumber is not a recognized number. Please try to identify if an error occured and then try again';
   
    if(iconNumber === 29)
       return 'Rain and snow are in the forecast. Grab a rain/snow jacket and an umbrella before you leave the house.';
   
    if(iconNumber === 30)
       return 'It is forecast to be very hot in the near future. Dress lightly and drink lots of fluids!';
   
    if(iconNumber === 31)
       return 'It is forecast  to be very cold in the near future. Dress heavily and stay warm!';
   
    if(iconNumber === 32)
       return 'It is forecast to be windy, but that is all. Consider dressing heavier as wind usually feels cold.';
   
    if(iconNumber <= 37)
       return 'No percipitation in sight! Feel free to leave the house without an umbrella.';
   
    if(iconNumber === 38)
       return 'It is cloudy but percipitation is not in the forecast. You do not need to take an unbrella but be mindful of the weather.';
   
    if(iconNumber <= 42)
       return 'Rain is in the forecast! Grab an umbrella before you leave the house.';
   
    return 'Snow is in the forecast! Grab a rain/snow jacket before you leave the house.';
}
export function adjust_Epoch_To_Time_Zone(epochtime:string, offset:string):number{
    return parseInt(epochtime) + parseInt(offset)*3600
}
export function get_hanging_minutes_of_epoch(epochtime:number):string{
   const d = new Date(epochtime*1000);
   return d.toString().split(":")[1];
}
export function generateUserId(id_length,alphabetInclude_flag, capital_letters_flag){

    let charset = '0123456789';
    if(alphabetInclude_flag !== 0) charset += 'abcdefghijklmnopqrstuvwxyz';
    if(capital_letters_flag !== 0) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let result = '';
    for (let i = 0, len = id_length; i < len; i++) {
        result += charset[Math.floor(Math.random() * charset.length)]
    }
    return result;
}
export function lastSyncDateTime():string{
    return "" + Date.now();
}
export function change_time_to_decimal(hours, minutes){
   const hour = parseInt(hours.toString());
   const min = parseInt(minutes);
   return hour + (min)/60;
}

export function weatherClearAndSort(forecasts_12hour){
   let threshold;

   if(forecasts_12hour[0].Temperature_Units === 'F')
       threshold = 15;
   else
       threshold = 5;
   
   let temperature = parseInt(forecasts_12hour[0].Temperature_Value);
   const newWeatherArray = [forecasts_12hour[0]];

   forecasts_12hour.forEach(element => {
       const currentTemp = parseInt(element.Temperature_Value)
       if(Math.abs(currentTemp - temperature) >= threshold) {
           temperature = currentTemp;
           newWeatherArray.push(element);
       }
   });

   return newWeatherArray;
}
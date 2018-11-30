"use strict";
/**
     ========================================================================================================
     ========================================   HELPER FUNCTIONS    =========================================
     ========================================================================================================
     */
Object.defineProperty(exports, "__esModule", { value: true });
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
function change_from_epoch_to_hour(epoch) {
    const currentDay = new Date(epoch * 1000);
    //return 24 hour time
    return currentDay.getHours();
}
exports.change_from_epoch_to_hour = change_from_epoch_to_hour;
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
function adjust_Epoch_To_Time_Zone(epochtime, offset) {
    return epochtime + parseInt(offset) * 3600;
}
exports.adjust_Epoch_To_Time_Zone = adjust_Epoch_To_Time_Zone;
function get_hanging_minutes_of_epoch(epochtime) {
    const d = new Date(epochtime * 1000);
    return d.toString().split(":")[1];
}
exports.get_hanging_minutes_of_epoch = get_hanging_minutes_of_epoch;
function generateUserId(id_length, alphabetInclude_flag, capital_letters_flag) {
    let charset = '0123456789';
    if (alphabetInclude_flag !== 0)
        charset += 'abcdefghijklmnopqrstuvwxyz';
    if (capital_letters_flag !== 0)
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0, len = id_length; i < len; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
}
exports.generateUserId = generateUserId;
function lastSyncDateTime() {
    const currentdate = new Date();
    const datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}
exports.lastSyncDateTime = lastSyncDateTime;
function change_time_to_decimal(hours, minutes) {
    const hour = parseInt(hours.toString());
    const min = parseInt(minutes);
    return hour + (min) / 60;
}
exports.change_time_to_decimal = change_time_to_decimal;
//# sourceMappingURL=helperfunctions.js.map
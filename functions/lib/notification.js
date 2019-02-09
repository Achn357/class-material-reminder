"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class notifications {
    //start time, end time, location, materials
    constructor(data) {
        this.totalschedule = {};
        this.totalschedule = data;
    }
    /**
     *
     * @param a removes any duplicate values in a single array
     */
    remove_duplicates(a) {
        const seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
    /**
     *
     * @param a give 2D array of ids for a single day
     */
    remove_empty_arrays(a) {
        return a.filter(item => item.length > 0);
    }
    /**
     * returns the schedule
     */
    getschedule() {
        return this.totalschedule['schedule'];
    }
    /**
     * returns the materials
     */
    getmaterials() {
        return this.totalschedule['materials'];
    }
    /**
     *
     * @param day_data the data for a single day
     * input:
     *
        [
            {id:162684,start:1,endtime:3,name:"Calc"},
            {id:668234,start:4,endtime:5,name:"Econ"},
            {id:839257,start:10,endtime:12,name:"Chem"},
            {id:472959,start:12.25,endtime:13,name:"PHYS"}
        ]

     * output:
     * [ [ 162684, 668234 ], [ 839257, 472959 ], [ 472959 ] ]
        
        Once you execute this function, you must then execute the || remove_all_stray_ids() || function
     */
    get_batch_ids(day_data) {
        const total_ids = [];
        let temp_batch = [];
        for (let x = 0; x < day_data.length; x++) {
            if (x === day_data.length - 1) {
                total_ids.push(this.remove_duplicates(temp_batch));
                total_ids.push([day_data[x].id]);
                break;
            }
            else {
                if ((day_data[x + 1].start - day_data[x].endtime) <= 2) {
                    temp_batch.push(day_data[x].id);
                    temp_batch.push(day_data[x + 1].id);
                }
                else {
                    if (temp_batch.length === 0) {
                        temp_batch.push(day_data[x].id);
                    }
                    total_ids.push(this.remove_duplicates(temp_batch));
                    temp_batch = [];
                }
            }
        }
        return this.remove_empty_arrays(total_ids);
    }
    /**
     * There are sometimes cases where the batch ids function gives: [[1,2,3],[4,5],[5]]
     * That ending 5 is repeated in the middle list, so this function removes that
     * @param totalarray a 2d array of numbers like so: [[1,2,3],[4,5],[5]]
     * return: [[1,2,3],[4,5]]
     */
    remove_last_element_from_next_to_last_list(totalarray) {
        if (totalarray.length > 1) {
            const last_number = totalarray[totalarray.length - 1][0];
            const second_to_last_list = totalarray[totalarray.length - 2];
            const second_to_last_number = second_to_last_list[second_to_last_list.length - 1];
            if ((last_number === second_to_last_number)) {
                totalarray.splice(-1, 1);
                return totalarray;
            }
            else {
                return totalarray;
            }
        }
        else {
            return totalarray;
        }
    }
    /**
     *
     * @param sch give the schedule part of the data like so:
     * schedule:{
        Monday:[
            {id:162684,start:1,endtime:3,name:"Calc"},
            {id:668234,start:4,endtime:5,name:"Econ"},
            {id:839257,start:10,endtime:12,name:"Chem"},
            {id:472959,start:12.25,endtime:13,name:"PHYS"}
        ],
        Tuesday:[
            {id:473875,start:2,endtime:3,name:"Engr"},
            {id:789324,start:6,endtime:8,name:"Arts"},
            {id:162684,start:13,endtime:20,name:"Calc"},
            
        ],
                            .
                            .
                        (more days)
                            .
                            .
        Sunday:[
            {id:367814,start:3,endtime:4,name:"rec"},
            {id:472938,start:15,endtime:20,name:"study"}
        ]
    }
     */
    get_batch_for_entireschedule() {
        const ids_by_day = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };
        const sch = this.getschedule();
        for (const key in sch) {
            if (sch.hasOwnProperty(key)) {
                const day_data = sch[key];
                ids_by_day[key] = this.remove_empty_arrays(this.get_batch_ids(day_data));
            }
        }
        return this.remove_all_stray_ids(ids_by_day);
    }
    /**
     *
     * @param ids_by_day give it the entire json of ids
     * input:
     * {
     *  Monday: [ [ 162684, 668234 ], [ 839257, 472959 ], [ 472959 ] ],
        Tuesday: [ [ 162684 ] ],
        Wednesday: [ [ 123789, 748432 ], [ 748432 ] ],
        Thursday: [ [ 103845, 463910 ], [ 463910 ] ],
        Friday: [ [ 527381 ] ],
        Saturday: [ [ 362819, 917238 ], [ 917238 ] ],
        Sunday: [ [ 367814, 835217 ], [ 472938 ] ]
       }

     * output:
       {
        Monday: [ [ 162684, 668234 ], [ 839257, 472959 ] ],
        Tuesday: [ [ 162684 ] ],
        Wednesday: [ [ 123789, 748432 ] ],
        Thursday: [ [ 103845, 463910 ] ],
        Friday: [ [ 527381 ] ],
        Saturday: [ [ 362819, 917238 ] ],
        Sunday: [ [ 367814, 835217 ], [ 472938 ] ]
        }
     */
    remove_all_stray_ids(ids_by_day) {
        for (const key in ids_by_day) {
            const hello = ids_by_day[key];
            ids_by_day[key] = this.remove_last_element_from_next_to_last_list(hello);
        }
        return ids_by_day;
    }
}
exports.notifications = notifications;
//# sourceMappingURL=notification.js.map
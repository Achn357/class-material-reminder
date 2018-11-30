"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class notifications {
    //start time, end time, location, materials
    constructor(swag) {
        this.totalschedule = {};
        this.totalschedule = swag;
    }
    remove_duplicates(a) {
        var seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
    remove_empty_arrays(a) {
        let new_array = a;
        for (let x = 0; x < new_array.length; x++) {
            if (new_array[x].length === 0) {
                new_array.splice(x, 1);
            }
        }
        return new_array;
    }
    getschedule() {
        return this.totalschedule['schedule'];
    }
    getmaterials() {
        console.log(this.totalschedule['materials']);
    }
    get_batch_ids(day_data) {
        let total_ids = [];
        let temp_batch = [];
        for (let x = 0; x < day_data.length; x++) {
            if (x == day_data.length - 1) {
                total_ids.push(remove_duplicates(temp_batch));
                total_ids.push([day_data[x].id]);
                break;
            }
            else {
                if ((day_data[x + 1].start - day_data[x].endtime) <= 2) {
                    temp_batch.push(day_data[x].id);
                    temp_batch.push(day_data[x + 1].id);
                }
                else {
                    total_ids.push(remove_duplicates(temp_batch));
                    temp_batch = [];
                }
            }
        }
    }
}
exports.notifications = notifications;
let data = {
    schedule: {
        Monday: [
            { id: 162684, start: 1, endtime: 3, name: "Calc" },
            { id: 668234, start: 4, endtime: 5, name: "Econ" },
            { id: 839257, start: 10, endtime: 12, name: "Chem" },
            { id: 472959, start: 12.25, endtime: 13, name: "PHYS" }
        ],
        Tuesday: [
            { id: 473875, start: 2, endtime: 3, name: "Engr" },
            { id: 789324, start: 6, endtime: 8, name: "Arts" },
            { id: 162684, start: 13, endtime: 20, name: "Calc" },
        ],
        Wednesday: [
            { id: 123789, start: 13, endtime: 14, name: "Chem" },
            { id: 748432, start: 15, endtime: 16, name: "Phys" }
        ],
        Thursday: [
            { id: 103845, start: 9, endtime: 10, name: "Pols" },
            { id: 463910, start: 8, endtime: 9, name: "Geog" }
        ],
        Friday: [
            { id: 181624, start: 11, endtime: 12, name: "Hist" },
            { id: 527381, start: 20, endtime: 21, name: "Engl" }
        ],
        Saturday: [
            { id: 362819, start: 17, endtime: 18, name: "party" },
            { id: 917238, start: 10, endtime: 13, name: "game" }
        ],
        Sunday: [
            { id: 367814, start: 3, endtime: 4, name: "rec" },
            { id: 835217, start: 6, endtime: 8.5, name: "study" },
            { id: 649274, start: 11, endtime: 12, name: "study" },
            { id: 472938, start: 15, endtime: 20, name: "study" }
        ]
    },
    materials: {
        Monday: [
            { id: 162684, materials: ["orange textbook", "laptop"] },
            { id: 668234, materials: ["blue textbook", "clicker"] },
            { id: 839257, materials: ["laptop", "clicker"] },
            { id: 472959, materials: ["calculator", "notebook", "clicker"] }
        ],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    }
};
function remove_duplicates(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
function remove_empty_arrays(a) {
    let new_array = a;
    for (let x = 0; x < new_array.length; x++) {
        if (new_array[x].length === 0) {
            new_array.splice(x, 1);
        }
    }
    return new_array;
}
function get_batch_ids(day_data) {
    let total_ids = [];
    let temp_batch = [];
    for (let x = 0; x < day_data.length; x++) {
        if (x == day_data.length - 1) {
            total_ids.push(remove_duplicates(temp_batch));
            total_ids.push([day_data[x].id]);
            break;
        }
        else {
            if ((day_data[x + 1].start - day_data[x].endtime) <= 2) {
                temp_batch.push(day_data[x].id);
                temp_batch.push(day_data[x + 1].id);
            }
            else {
                total_ids.push(remove_duplicates(temp_batch));
                temp_batch = [];
            }
        }
    }
    return remove_empty_arrays(total_ids);
}
const sch = data.schedule;
let ids_by_day = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};
function remove_last_element(totalarray) {
    const one_before = 1;
}
for (let key in sch) {
    if (sch.hasOwnProperty(key)) {
        const day_data = sch[key];
        ids_by_day[key] = remove_empty_arrays(get_batch_ids(day_data));
    }
}
console.log(ids_by_day);
//# sourceMappingURL=notification.js.map
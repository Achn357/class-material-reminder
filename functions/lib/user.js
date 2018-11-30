"use strict";
/**
     ========================================================================================================
     ==========================================   'USER' CLASS    ===========================================
     ========================================================================================================
     */
Object.defineProperty(exports, "__esModule", { value: true });
class user {
    constructor(uid, locid) {
        this.user_id = "";
        this.location_id = "";
        this.loca = "";
        this.latitude = "";
        this.longitude = "";
        this.gmtoffset = "";
        this.user_id = uid;
        this.location_id = locid;
    }
    set_user_id(id) {
        this.user_id = id;
    }
    set_location_id(id) {
        this.location_id = id;
    }
    set_location(loc) {
        this.loca = loc;
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
    get_user_id() {
        return this.user_id;
    }
    get_location_id() {
        return this.location_id;
    }
    get_location() {
        return this.loca;
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
}
exports.user = user;
//# sourceMappingURL=user.js.map
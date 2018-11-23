/**
     ========================================================================================================
     ==========================================   'USER' CLASS    ===========================================
     ========================================================================================================
     */


     
export class user{
    private user_id:string = "";
    private location_id:string ="";
    private loca:string = "";
    private latitude="";
    private longitude="";
    private gmtoffset="";

    constructor(uid, locid){
        this.user_id = uid;
        this.location_id = locid;
    }


    public set_user_id(id):void{
        this.user_id = id;
    }
    public set_location_id(id):void{
        this.location_id = id;
    }
    public set_location(loc:string):void{
        this.loca = loc;
    }
    public set_longitude(long):void{
        this.longitude = long;
    }
    public set_latitude(lat):void{
        this.latitude = lat;
    }
    public set_gmtoffset(off):void{
        this.gmtoffset = off;
    }
    


    public get_user_id():string{
        return this.user_id;
    }
    public get_location_id():string{
        return this.location_id;
    }
    public get_location():string{
        return this.loca;
    }
    public get_longitude(){
        return this.longitude;
    }
    public get_latitude(){
        return this.latitude;
    }
    public get_gmtoffset(){
        return this.gmtoffset;
    }
}
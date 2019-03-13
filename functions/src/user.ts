export class User {
    private locationkey;
    private gmtoffset;
    public getLocationKey():string{
      return this.locationkey;
    }
    public setLocationKey(loc:string):void{
      this.locationkey = loc;
    }
    public getGmtOffset():string{
      return this.gmtoffset;
    }
    public setGmtOffset(gmt:string):void{
      this.gmtoffset = gmt;
    }
  }
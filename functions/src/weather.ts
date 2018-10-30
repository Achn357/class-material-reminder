import * as fetch from 'node-fetch'

export function conv_to_query(strToConvert:string): string{
    let newstr:string = ""
    for (let i:number=0; i< strToConvert.length; i++){
      if(strToConvert[i] === " "){
        newstr += "+"
      }else{
        newstr+=strToConvert[i]
      }
    }
    return newstr;
}

export async function getlocationkey (key,location){
    return fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${key}&q=${location}`)
    .then(response => response.json())
    .catch(err => console.log('Oops something went wrong' + err))
}

export class weatherScanner{
    private readonly weatherapikey:string;
    private location:string;
    constructor(apikey:string, location:string){
        this.weatherapikey = apikey;
        this.location = conv_to_query(location);
    }
    public changelocation (newlocation:string):void{
        this.location = conv_to_query(newlocation);
    }

    public async getLocationKey(){
        return await getlocationkey(this.weatherapikey, this.location)
        .then((json)=>{
            let finalobject:Array<Object> = [];
            for (let x=0; x<json.length; x++){
                let locationinfo ={locationkey:"", name:"",state:"", country:"", lat:"", lng:""};

                locationinfo.locationkey = json[x].Key;
                locationinfo.name = json[x].EnglishName;
                locationinfo.country = json[x].Country.EnglishName;
                locationinfo.state = json[x].AdministrativeArea.EnglishName;
                locationinfo.lat = json[x].GeoPosition.Latitude;
                locationinfo.lng = json[x].GeoPosition.Longitude;
                
                finalobject.push(locationinfo)
            }
            return finalobject
        }).catch(err => {
            console.log(err)
        })
    }
    public getLocation():string{
        return this.location
    }
}


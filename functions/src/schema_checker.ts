export class schemaChecker{
    private schema:Object;
    public constructor(json:Object){
        this.schema = json;
    }
    public getSchema(){
        return this.schema;
    }
    public compare_schema(checking_needed_json):any{
        let missing_keys_json:Object =this.getSchema();
        
        for(let key in checking_needed_json){
            if(missing_keys_json.hasOwnProperty(key)){
                delete missing_keys_json[key]
            }
        
        }

        let missing_keys:Array<string> = []
        for(let key in missing_keys_json){
            missing_keys.push(key)
        }
        return missing_keys
    }
}
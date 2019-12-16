export default class DataNode{
    constructor(){
        this.original_data = [];
        
        // key: value/ range
        this.defaultDivide = 20;
        this.keyMap = {};
        this.keyRange = {};
        this.keyPeriod = {};
        this.drawType = "";
        this.scene ="";
        this.chosenAttritube = [];
        this.currentSelection = "";
        // key: dictionary that use the assigned attribute as the key of this dictionary
        // for value type variables, with specific keys (like: name); for range type variables, with ranged keys (like: time) 
        this.keyDicList = {};
        this.nowFilter = {};
        this.isEmpty = function(obj) {
            return Object.keys(obj).length === 0;
        }
        this.inRange_key = function(key_name, period, check_target){
            // first check the min max range 
            var min = this.keyRange[key_name]["min"];
            var max = this.keyRange[key_name]["max"];
            var now_threshold = min;

            if(min == max){
                console.log("DATANODE: it is not a range variable");
            }
            else{
               while(check_target > now_threshold + period){
                    now_threshold = now_threshold + period;
                }
            }
            //console.log()
            //console.log("DATANODE: new range key: "+now_threshold);
            return now_threshold;
        }
        this.setScene = function(scene){
            this.scene = scene;
        }
        this.setChosenAttribute = function(attributes){
            this.chosenAttritube = attributes;
        }
        this.setRenderType = function(new_type){
            this.drawType = new_type;
        }
        this.setKeyRange = function(key_name, min_max, value){
            if(!(key_name in this.keyRange)){
                // initial the range
                this.keyRange[key_name] = {};
                this.keyRange["min"] = -1;
                this.keyRange["max"] = -1;

                this.keyRange[key_name][min_max] = value;
            }
            else{
                this.keyRange[key_name][min_max] = value;
            }
        }
        this.setKeyValue = function(key_name, value){
            if(!(key_name in this.keyMap) ){
                // don't have this key
                this.keyMap[key_name] = value;
                //console.log("DATANODE: don't have this key");
                //console.log("DATANODE: set key map, key = "+key_name+" value = "+value);
            }
            else{
                this.keyMap[key_name] = value;
            }

            if(value == "range"){
                this.keyPeriod[key_name] = (this.keyRange[key_name]["max"] - this.keyRange[key_name]["min"])/this.defaultDivide;
                //console.log("DATANODE: computed period = ");
                //console.log(this.keyPeriod[key_name]);
            }
        }
        this.setKeyPeriod = function(key_name, value){
            if(!(key_name in this.keyPeriod) ){
                // don't have this key
                this.keyPeriod[key_name] = value;
                //console.log("DATANODE: don't have this key");
                //console.log("DATANODE: set key map, key = "+key_name+" value = "+value);
            }
            else{
                this.keyPeriod[key_name] = value;
            }


        }
        this.fileTruncate = function(number_record, data){
            // if data less than number of record, then do nothing
            // otherwise, truncate to assigned data numbers
            var new_data  =[];
            if(data.length >= number_record){
                console.log("total number = "+data.length+", truncate to = "+number_record);
                new_data = data.slice(0, number_record -1);
            }
            else{
                console.log("total number = "+data.length+", not truncate");
                new_data = data;
            }
            return new_data
        }
    }
    testFunction(){
        console.log("This function is to make sure the class DataNode is functional.");
    }
    initKeyMap(){
        // go through the data and save the keys
        //temp_key_min = {}
        //temp_key_max = {}
        for(var record in this.original_data){
            //console.log(this.original_data[record]);
            for(var key_in_data in this.original_data[record]){
                //console.log(key_in_data);
                if(!(key_in_data in this.keyMap)){
                    //set all attribute to "value" first
                    this.setKeyValue(key_in_data, "value");
                    this.setKeyRange(key_in_data, "max", -1);
                    this.setKeyRange(key_in_data, "min", -1);

                    // record the range for this attribute
                    if( typeof( this.original_data[record][key_in_data] ) == "number"){
                        this.setKeyRange(key_in_data, "max", this.original_data[record][key_in_data]);
                        this.setKeyRange(key_in_data, "min", this.original_data[record][key_in_data]);
                    }
                }
                else{
                    var current_key_min = this.keyRange[key_in_data]["min"];
                    var current_key_max = this.keyRange[key_in_data]["max"];

                    //the data inside the attribute, if it is a number
                    if( typeof( this.original_data[record][key_in_data] ) == "number"){
                        if(this.original_data[record][key_in_data] >= current_key_max){
                            this.setKeyRange(key_in_data, "max", this.original_data[record][key_in_data]);
                        }
                        else if(this.original_data[record][key_in_data] <= current_key_min){
                            this.setKeyRange(key_in_data, "min", this.original_data[record][key_in_data]);
                        }
                    }
                    else{
                        //console.log("DATANODE: it is not a number, can not be compared range");
                    }
                }
            }
        }

        //set default period
        for(var name in this.keyMap){

            this.keyPeriod[name] = 0;
        }

    }
    processDictionary(){
        if(this.isEmpty(this.keyMap)){
            console.log("DATANODE: this function should be called later, because the key map is empty");
        }
        else{
            console.log("DATANODE: checking the key map");
            for(var record in this.original_data){
                for(var key_in_data in this.original_data[record]){
                    if(!(key_in_data in this.keyDicList)){
                        //create new dictionary
                        this.keyDicList[key_in_data] = {};
                    }
                    else{
                        // get current dictionary
                        var now_dictionary = this.keyDicList[key_in_data];
                        var now_value = this.original_data[record][key_in_data];
                        var now_record = this.original_data[record];

                        if(this.keyMap[key_in_data] == "value"){
                            if(typeof(now_value) == "list"){
                                // if it is a list
                                for(var element in now_value){
                                    if(!(element in now_dictionary)){
                                        now_dictionary[element] = [];
                                        now_dictionary[element].push(now_record);
                                    }
                                    else{
                                        now_dictionary[element].push(now_record);
                                    }                                    
                                }
                            }
                            else{
                                if(!(now_value in now_dictionary)){
                                    now_dictionary[now_value] = [];
                                    now_dictionary[now_value].push(now_record);
                                }
                                else{
                                    now_dictionary[now_value].push(now_record);
                                }
                            }
                            this.keyDicList[key_in_data] = now_dictionary;
                        }
                        else if(this.keyMap[key_in_data] == "range"){
                            //(key_name, period, check_target)
                            var new_key = this.inRange_key(key_in_data, this.keyPeriod[key_in_data], now_value);

                            if(!(new_key in now_dictionary)){
                                now_dictionary[new_key] = [];
                                now_dictionary[new_key].push(now_record);
                            }
                            else{
                                now_dictionary[new_key].push(now_record);
                            }
                            this.keyDicList[key_in_data] = now_dictionary;
                        }
                        
                    }
                }

            }
        }      
    }
}
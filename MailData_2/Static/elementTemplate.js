
import * as ORTHOCAMERA from "./orthoCamera.js"

export function drawSelectionBox(datanode, parent_name, relative_div, content_div, div_name, type, value){
    // add a small div
    // a radio box
    // canvas with 
    // Your existing code unmodified...
    var new_div = document.createElement('div');
    new_div.id = 'div_'+div_name;
    new_div.className = 'attribute_div';
    var target = document.getElementById(parent_name);
    target.appendChild(new_div);

    // append a radio box
    var radio = document.createElement("input");
    radio.id = "div_radio_"+div_name;
    radio.className = "radio_div"
    radio.setAttribute("type", "checkbox");
    radio.onchange = function(){
        if(radio.checked){
            console.log("ELEMENTTEMPLATE: "+radio.id);
            // clear all in selection frame
            // show content here

            datanode.nowFilter = datanode.keyDicList[value];
            // hard coding in here
            var clear_target = document.getElementById(relative_div);
            var clear_target_2 = document.getElementById(content_div);
            while (clear_target.firstChild) {
                clear_target.removeChild(clear_target.firstChild);
            }
            while (clear_target_2.firstChild) {
                clear_target_2.removeChild(clear_target_2.firstChild);
            }

            if(type == "value"){
                // create values
                for(var sub_value in datanode.keyDicList[value]){
                    drawTag(datanode, relative_div, content_div, sub_value, value);
                }
            }
            else if(type == "range"){
                // get range
                drawRange(datanode, relative_div, content_div, value, datanode.keyRange[value]["min"], datanode.keyRange[value]["max"])
            }
            var data_count = 0;
            for(var now_attritube in datanode.keyDicList[value]){
                for(var per_data in datanode.keyDicList[value][now_attritube ]){
                    drawContent(content_div, data_count, JSON.stringify(datanode.keyDicList[value][now_attritube ][per_data]));
                    data_count = data_count +1;
                }
            }            
        }
        else{
            console.log("ELEMENTTEMPLATE: cancel "+radio.id);
            datanode.nowFilter = {};
            var clear_target = document.getElementById(relative_div);
            var clear_target_2 = document.getElementById(content_div);
            while (clear_target.firstChild) {
                clear_target.removeChild(clear_target.firstChild);
            }
            while (clear_target_2.firstChild) {
                clear_target_2.removeChild(clear_target_2.firstChild);
            }            
        }

    }
    new_div.appendChild(radio);    
    // append a div with text
    var new_div_text = document.createElement('div');
    new_div_text.id = 'div_text_'+div_name;
    new_div_text.className = 'text_div';
    new_div_text.innerHTML = div_name;
    //var target = document.getElementById(parent_name);
    new_div.appendChild(new_div_text);
}
export function drawTag(datanode, parent_name, content_div, tag_name, attribute){
    var new_div = document.createElement('div');
    new_div.id = 'div_'+tag_name;
    new_div.className = 'tag_div';
    var target = document.getElementById(parent_name);
    target.appendChild(new_div);

    var tag_button = document.createElement("input");
    //Assign different attributes to the element. 
    tag_button.id = "tag_"+tag_name;
    tag_button.className = "tag_button"; 

    //tag_button.innerHTML = tag_name;
    tag_button.value = tag_name;

    //var target = document.getElementById(parent_name);

    new_div.appendChild(tag_button);
    tag_button.onclick = function() { // Note this is a function
        //console.log(tag_button.id);
        //var resetBottun = document.getElementById("resetButton");
        //var parentOfResetButton = resetBottun.parentElement;
        //parentOfResetButton.removeChild(resetBottun);
        //target.removeChild(tag_button);
        
        // filter data
    };

    var tag_close = document.createElement("input");
    //Assign different attributes to the element. 
    tag_close.id = "tag_close_"+tag_name;
    tag_close.className = "tag_close_button"; 

    //tag_button.innerHTML = tag_name;
    tag_close.value = "X";

    new_div.appendChild(tag_close);
    tag_close.onclick = function() { // Note this is a function
        console.log(tag_close.id);

        //datanode.setRenderType("Stat");

        //var resetBottun = document.getElementById("resetButton");
        //var parentOfResetButton = resetBottun.parentElement;
        //parentOfResetButton.removeChild(resetBottun);
        //target.removeChild(tag_close);
        //target.removeChild(tag_button);
        target.removeChild(new_div);
        var clear_target_2 = document.getElementById(content_div);
        while (clear_target_2.firstChild) {
            clear_target_2.removeChild(clear_target_2.firstChild);
        }
        //console.log(datanode.nowFilter);

        delete datanode.nowFilter[tag_name];
        //console.log(datanode.nowFilter);
        var data_count = 0;
        for(var now_attritube in datanode.nowFilter){
            //console.log(now_attritube);
            if(!(now_attritube == tag_name)){
                for(var per_data in datanode.keyDicList[attribute][now_attritube ]){
                    drawContent(content_div, data_count, JSON.stringify(datanode.keyDicList[attribute][now_attritube ][per_data]));
                    data_count = data_count +1;
                }
            }
        }        
        ORTHOCAMERA.updateRender(datanode);        

    };

}
export function drawRange(datanode, parent_name,  content_div, div_name, min, max){
    
    // base div
    var new_div = document.createElement('div');
    new_div.id = 'div_'+div_name;
    new_div.className = 'range_div';
    var target = document.getElementById(parent_name);
    target.appendChild(new_div);

    // text field
    var left_text = document.createElement("input");
    left_text.className = "left_text_range";
    left_text.setAttribute("type", "text");
    left_text.setAttribute("value", min);

    new_div.appendChild(left_text);   
    // div
    var new_div_text = document.createElement('div');
    new_div_text.id = 'div_text_'+div_name;
    new_div_text.className = 'text_div_range';
    new_div_text.innerHTML = "~";
    //var target = document.getElementById(parent_name);
    new_div.appendChild(new_div_text);

    // text field
    var right_text = document.createElement("input");
    right_text.className = "right_text_range";
    right_text.setAttribute("type", "text");
    right_text.setAttribute("value", max);
    new_div.appendChild(right_text);       
    left_text.onchange = function(){
        console.log("now min = "+left_text.value +", max = "+right_text.value);
        
        // update now_filter
        var clear_target_2 = document.getElementById(content_div);
        while (clear_target_2.firstChild) {
            clear_target_2.removeChild(clear_target_2.firstChild);
        }
        var data_count = 0;
        for(var key in datanode.nowFilter){
            if(key < left_text.value){
                //console.log(datanode.nowFilter);

                delete datanode.nowFilter[key];  
                //console.log(datanode.nowFilter);
                              
            }
            else{

                for(var current_data in datanode.nowFilter[key]){
                    drawContent(content_div, data_count, JSON.stringify(datanode.nowFilter[key][current_data]));
                    var data_count = data_count +1;
                }

            }            
        }
        ORTHOCAMERA.renderData(datanode);
        
        
    }
    right_text.onchange = function(){
        console.log("now min = "+left_text.value +", max = "+right_text.value);
        // update now_filter
        var clear_target_2 = document.getElementById(content_div);
        while (clear_target_2.firstChild) {
            clear_target_2.removeChild(clear_target_2.firstChild);
        }
        var data_count = 0;
        for(var key in datanode.nowFilter){
            if(key > right_text.value){
                //console.log(datanode.nowFilter);
                delete datanode.nowFilter[key];  
                //console.log(datanode.nowFilter);             
            }
            else{
                for(var current_data in datanode.nowFilter[key]){
                    drawContent(content_div, data_count, JSON.stringify(datanode.nowFilter[key][current_data]));
                    var data_count = data_count +1;
                }

            }
        }
        ORTHOCAMERA.renderData(datanode);
    }

}
export function drawContent(parent_name, div_name, content){
    // base div
    //console.log(content);

    var new_div = document.createElement('div');
    new_div.id = 'div_'+div_name;
    new_div.className = 'content_div';
    new_div.innerHTML = content;
    var target = document.getElementById(parent_name);
    target.appendChild(new_div);    
}
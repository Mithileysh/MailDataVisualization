//const vis_main = require('./timeline_vis.js');
import DataNode, * as DATANODE from "./dataNode.js"
import * as ELEMENTTEMPLATE from "./elementTemplate.js"
import * as MAILDATA from "./mail_data.js";
import * as TIMELINE_MOUSE from "./timeline_mouse.js";
import * as MOUSEOVER from "./mouseover.js";
import * as ORTHOCAMERA from "./orthoCamera.js"
import * as NETWORK from "./network_vis.js";
import * as FRQUENCY from "./frequency_vis.js";
import * as TIMELINE from "./timeline_vis.js";


function initial_function(datanode){
    // call all the functions need to be executed when onload
    var mail_data = datanode.original_data;
    //Shared_data = MAILDATA.mail_data(mail_data);
    for(var key in datanode.keyMap){
        ELEMENTTEMPLATE.drawSelectionBox(datanode, "focus_frame", "selection_frame", "content_frame",key, datanode.keyMap[key], key);
    }

    //call visualization function in here


    //NETWORK.network_vis(mail_data);
    //FRQUENCY.frequency_vis(mail_data);  
    //TIMELINE.timeline_vis(mail_data);
    //TIMELINE_MOUSE.timeline_mouse(mail_data);
    //MOUSEOVER.mouseover(mail_data);
    //ORTHOCAMERA.init("timeline", mail_data);
    //ORTHOCAMERA.init("network", mail_data);
    //ORTHOCAMERA.init("frequency", mail_data);
    //ORTHOCAMERA.animate();

}

$.getJSON('/real/enron_mail_20150507.json', function(data) {
    

    var datanode = new DataNode();
    datanode.testFunction();

    // record the limitation of the visualization
    var target_data = datanode.fileTruncate(5000, data);
 
    
    datanode.original_data = target_data;
    datanode.initKeyMap();
    // //check the keys
    // const keys = Object.keys(datanode.original_data);
    // Object.entries(datanode.original_data).forEach(([key, value]) => {
    //     console.log(key, value);
    // });
    // set type for special attribute
    datanode.setKeyValue("time", "range");
    datanode.setKeyValue("sentiment", "range");
    datanode.setKeyValue("oddness", "range");

    //datanode.drawType = "Timeline";
    datanode.drawType = "Test";
    datanode.chosenAttritube = ["oddness", "sender", "receiver"];
    ORTHOCAMERA.renderData(datanode);
    //datanode.drawType = "Network";
    //datanode.drawType = "Stat";
    
    // year: 31591200
    // month: 2596530
    // week: 605857
    // day: 86551 
    datanode.processDictionary();
    //check the key map
    console.log("CHECK: ");
    console.log(datanode.keyMap);
    console.log("CHECK: ");
    console.log(datanode.keyRange);
    console.log("CHECK: ");
    console.log(datanode.keyPeriod);
    console.log("CHECK: ");
    console.log(datanode.keyDicList);

    window.onload = initial_function(datanode);            

});


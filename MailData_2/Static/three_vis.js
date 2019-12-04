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

    ELEMENTTEMPLATE.drawSelectionBox("focus_frame", "attritube_1");
    ELEMENTTEMPLATE.drawSelectionBox("focus_frame", "attritube_2");
    ELEMENTTEMPLATE.drawSelectionBox("focus_frame", "attritube_3");

    ELEMENTTEMPLATE.drawTag("selection_frame", "in_queue_1");
    ELEMENTTEMPLATE.drawTag("selection_frame", "in_queue_2");
    ELEMENTTEMPLATE.drawTag("selection_frame", "in_queue_3");

    ELEMENTTEMPLATE.drawRange("selection_frame", "range_1", 0, 100);
    ELEMENTTEMPLATE.drawRange("selection_frame", "range_2", 30000, 123456);

    //ELEMENTTEMPLATE.drawRange("content_frame", "content_1", datanode.original_data[0]);
    //ELEMENTTEMPLATE.drawRange("content_frame", "content_2", datanode.original_data[1]);
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

$.getJSON('/real/enron_mail_20150507_1999_2000.json', function(data) {
    

    var datanode = new DataNode();
    datanode.testFunction();

    datanode.original_data = data;
    datanode.initKeyMap();
    // //check the keys
    // const keys = Object.keys(datanode.original_data);
    // Object.entries(datanode.original_data).forEach(([key, value]) => {
    //     console.log(key, value);
    // });
    // set type for special attribute
    datanode.setKeyValue("time", "range");
    datanode.setKeyValue("sentiment", "range");
    
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


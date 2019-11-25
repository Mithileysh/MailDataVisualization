//const vis_main = require('./timeline_vis.js');
import * as MAILDATA from "./mail_data.js";
import * as TIMELINE_MOUSE from "./timeline_mouse.js";
import * as MOUSEOVER from "./mouseover.js";
import * as ORTHOCAMERA from "./orthoCamera.js"
import * as NETWORK from "./network_vis.js";
import * as FRQUENCY from "./frequency_vis.js";
import * as TIMELINE from "./timeline_vis.js";


function initial_function(mail_data){
    // call all the functions need to be executed when onload
    MAILDATA.mail_data(mail_data);
    //NETWORK.network_vis(mail_data);
    //FRQUENCY.frequency_vis(mail_data);  
    //TIMELINE.timeline_vis(mail_data);
    //TIMELINE_MOUSE.timeline_mouse(mail_data);
    //MOUSEOVER.mouseover(mail_data);
    ORTHOCAMERA.init("timeline", mail_data);
    //ORTHOCAMERA.init("network", mail_data);
    //ORTHOCAMERA.init("frequency", mail_data);
    ORTHOCAMERA.animate();

}

$.getJSON('/real/enron_mail_20150507_1999_2000.json', function(data) {
    
    var mail_data = [];
    mail_data = data;
    //console.log(mail_data);
    //window.onload = TIMELINE.timeline_vis(mail_data);
    //window.onload = NETWORK.network_vis(mail_data);
    window.onload = initial_function(mail_data);            

});


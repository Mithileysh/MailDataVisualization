/*
* Draw the mail data in left frame
*
*/
export function mail_data(mail_data) {
    //console.log(mail_data);
    
    function loadCanvas(div_id, index, mail, div_width, div_height) {
        //console.log(mail);
        var canvas = document.createElement('canvas');
        var div = document.getElementById(div_id); 
        canvas.id = "canvas"+index;
        canvas.width = div_width*0.8;
        const x = canvas.width / 100;

        canvas.height = div_height*0.05;
        const y = canvas.height / 3;

        canvas.style.marginLeft = div_width*0.05;
        canvas.style.marginTop = (canvas.height+5)*index;
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        // below is optional
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        var mail_text = JSON.stringify(mail);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.textAlign = "left";
        ctx.fillText(mail_text, x, y);

        div.appendChild(canvas)
    }
    var mail_count = 0;
    var div_width = $("#left_frame").width();
    var div_height = $("#left_frame").height();

    mail_data.forEach(element => {
        //console.log(element);

        //create a div/ canvas and show mail data
        loadCanvas("left_frame", mail_count, element, div_width, div_height);
        
        mail_count = mail_count + 1;

    });

}
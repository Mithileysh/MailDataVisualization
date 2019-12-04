export function drawSelectionBox(parent_name, div_name){
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
    new_div.appendChild(radio);    
    // append a div with text
    var new_div_text = document.createElement('div');
    new_div_text.id = 'div_text_'+div_name;
    new_div_text.className = 'text_div';
    new_div_text.innerHTML = div_name;
    //var target = document.getElementById(parent_name);
    new_div.appendChild(new_div_text);
}
export function drawTag(parent_name, tag_name){
    var tag_button = document.createElement("input");
    //Assign different attributes to the element. 
    tag_button.id = "tag_"+tag_name;
    tag_button.className = "tag_button"; 
    tag_button.onclick = function() { // Note this is a function
      console.log(tag_button.id);
    };
    //tag_button.innerHTML = tag_name;
    tag_button.value = tag_name;

    var target = document.getElementById(parent_name);
    target.appendChild(tag_button);

}
export function drawRange(parent_name,  div_name, min, max){
    
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
}
export function drawContent(parent_name, div_name, content){
    // base div
    var new_div = document.createElement('div');
    new_div.id = 'div_'+div_name;
    new_div.className = 'content_div';
    new_div.innerHTML = content;
    var target = document.getElementById(parent_name);
    target.appendChild(new_div);    
}
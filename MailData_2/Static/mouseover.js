import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';

export function mouseover(mail_data) {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 100;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // put the camera on a pole (parent it to an object)
    // so we can spin the pole to move the camera around the scene
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
    }




//=========================================
// data in here

    var [name_map, name_list, min_time, max_time]  = get_mail_node(mail_data, 100, 100);
    function get_mail_node(mail_data, width, height){
        var name_map = {};
        var name_list = [];
        var min_time = 0;
        var max_time = 0;

        for (var key in mail_data) { 
            //console.log(mail_data[key]["sender"]);
            //console.log(key);
            var sender_name = mail_data[key]["sender"];
            var receiver_names = mail_data[key]["receiver"];
            
            //update time 
            if(key == 0){
                max_time = mail_data[key]["time"];
                min_time = mail_data[key]["time"];
            }
            else{
                if(mail_data[key]["time"]< min_time){
                    min_time = mail_data[key]["time"];
                }
                if(mail_data[key]["time"]>max_time){
                    max_time = mail_data[key]["time"];
                }

            }


            if(!(sender_name in name_map)){
                
                var name_color = randomColor();
                var name_x = Math.floor(Math.random() * width);
                var name_y = Math.floor(Math.random() * height);
                var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": receiver_names};

                name_map[sender_name] = new_node;
                name_list.push(sender_name);
                
            }
            else{
                
                for(var receiver_name in receiver_names){
                    if(!(receiver_names[receiver_name] in name_map[sender_name]["end"])){
                        name_map[sender_name]["end"].push(receiver_names[receiver_name]);
                        //console.log("not show before");
                    }
                }
            }

        }
        return [name_map, name_list, min_time, max_time]
    }



//=========================================
// geo from here

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function rand(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return min + (max - min) * Math.random();
    }

    function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
    }

    //const numObjects = 100;
    var cube_position = {};
    var cube_info = {}
    const cubes = name_list.map((name) => {
        //because it focus on the sender, so we only count once even if the sender sent to multiple receivers
        var people_name = name;
        //const cubePivot = new THREE.Object3D();
        
        //var obj = JSON.parse(JSON.stringify(cubePivot));
        //console.log(obj["object"]["uuid"]);

        //scene.add(cubePivot);

        var new_color = name_map[people_name]["color"];
        //console.log(typeof(0xa6f379))
        const material = new THREE.MeshPhongMaterial({
            color: new_color,
        });
        const cube = new THREE.Mesh(geometry, material);
        //cubePivot.add(cube);
        var obj = JSON.parse(JSON.stringify(cube));
        scene.add(cube);

        var cube_x = Math.floor(name_map[people_name].x-50);
        var cube_y = Math.floor(name_map[people_name].y-50);
        var position_key = ""+cube_x+"_"+cube_y;
        cube_position[position_key] = obj["object"]["uuid"];
        cube_info[obj["object"]["uuid"]] = name;
        cube.position.set(cube_x, cube_y, 0);

        //cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
        cube.rotation.set(0, 0, 0);
        //cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
        cube.scale.set(name_map[people_name]["end"].length/50, name_map[people_name]["end"].length/50, 1);

        //return cubePivot;
        return cube;
    });

    console.log(cube_position);
    console.log(cube_info);


    function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
    }

    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            //console.log("pick in "+normalizedPosition);
            if (this.pickedObject) {
            // console.log(this.pickedObject);
                
                // if picked is ture
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }

            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            //console.log(intersectedObjects);


            if (intersectedObjects.length) {
                // pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                //console.log(JSON.stringify(this.pickedObject));
                var obj = JSON.parse(JSON.stringify(this.pickedObject));
                console.log(cube_info[obj["object"]["uuid"]]);

                var c = document.getElementById("text_message");
                var ctx = c.getContext("2d");
                var dpi = window.devicePixelRatio;


                function fix_dpi() {
                    //get CSS height
                    //the + prefix casts it to an integer
                    //the slice method gets rid of "px"
                    let style_height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
                    //get CSS width
                    let style_width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);
                    //scale the canvas
                    c.setAttribute('height', style_height * dpi);
                    c.setAttribute('width', style_width * dpi);
                }


                fix_dpi();
                ctx.clearRect(0,0,c.width,c.height);
                ctx.font ="14px Arial";
                const x = c.width / 10;
                const y = c.height / 3;
                
                ctx.fillStyle = "#FFFFFF";
                ctx.textAlign = "left";
                ctx.fillText(cube_info[obj["object"]["uuid"]], 10, 50);
    
       

                
                // save its color
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0x0000FF : 0xFF0000);
                //this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFF00FF : 0xFF00FF);
            }
        }
    
    }// end of PickHelper class

    const pickPosition = {x: 0, y: 0};
    const pickHelper = new PickHelper();


    clearPickPosition();

    function render(time) {
        time *= 0.001;  // convert to seconds;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        //cameraPole.rotation.y = time * .1;

        pickHelper.pick(pickPosition, scene, camera, time);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    var mail_count = 0;
    for(var cube in cubes){
        console.log(cubes[cube]);
        //var now_name = mail_data[mail_count]["sender"];
        //console.log(min_time+", "+max_time+", "+width);
       mail_count = mail_count + 1;
    }



    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        //console.log(rect);
        //console.log("event_position: "+event.clientX+", "+event.clientY);
        //console.log("rectangle_position: "+rect.left+", "+rect.top);
        //console.log("position: "+(event.clientX - rect.left)+", "+(event.clientY - rect.top));
        

        if(position_string in cube_position){
            
 


            var position_string = ""+rect.left+"_"+rect.top;

            console.log("this object: "+ cube_position[position_string]);
    
        }

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, {passive: false});

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);
}

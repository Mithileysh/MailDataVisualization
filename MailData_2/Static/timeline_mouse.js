
// Three.js - Cameras - Orthographic Canvas Top Left Origin
// from https://threejsfundamentals.org/threejs/threejs-cameras-orthographic-canvas-top-left-origin.html

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
//import * as THREE from './three.module.js';


export function timeline_mouse(mail_data) {

    const canvas = document.querySelector('#c');
    //console.log(mail_data);

    const left = 0;
    const right = 1600;  // default canvas size
    const top = 0;
    const bottom = 900;  // defautl canvas size
    const near = -1;
    const far = 1;
    const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.zoom = 1;
    const renderer = new THREE.WebGLRenderer({canvas});

    var width = right - left;
    var height = bottom - top;
    var [name_map, name_list, min_time, max_time]  = get_mail_node(mail_data, width, height);
    //console.log(name_map);
    //console.log(name_list);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const loader = new THREE.TextureLoader();

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
                
                /*
                if(sender_name.includes("enron")){
                    var name_color = 0x467dff;
                }
                else{
                    var name_color = 0xff8246;
                }
                */
                var name_color = randomColor();
                var name_x = 100;
                var name_y = Object.keys(name_map).length*6+20;
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
            
/*
            for(var receiver_name in receiver_names){
                
                if(!(receiver_names[receiver_name] in name_map)){
                    var name_color = randomColor();
                    var name_x = 100;
                    var name_y = Object.keys(name_map).length*5;
                    var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": [] };

                    name_map[receiver_names[receiver_name]] = new_node;
                    name_list.push(receiver_names[receiver_name]);                               
                }

            }

*/
        }
        return [name_map, name_list, min_time, max_time]
    }

    function randomColor(){
        var color_string = "0x"
        for(var color_index = 0; color_index <3; color_index++){
            var color_number = Math.floor(Math.random() * 240)+16;
            color_string = color_string + color_number.toString(16);

        }
        var color_number = parseInt(color_string);
        return color_number
    }
    
    function computeTimeLocation(current_time, min_time, max_time, width){

        var new_x = (current_time - min_time)/(max_time - min_time)*width;
        return new_x
    
    }

    const planes = mail_data.map((mail) => {
        //console.log(mail);
        //console.log(name_map[name]["end"].length)
        var sender_name = mail["sender"];
        // it is a list
        var receiver_name = mail["receiver"];

        //because it focus on the sender, so we only count once even if the sender sent to multiple receivers
        const planeSize = 5;
        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planePivot = new THREE.Object3D();
        scene.add(planePivot);

        var new_color = name_map[sender_name]["color"];
        //console.log(typeof(0xa6f379))
        const planeMat = new THREE.MeshBasicMaterial( {color: new_color, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        planePivot.add(mesh);
        // move plane so top left corner is origin
        //mesh.position.set(planeSize / 2, planeSize / 2, 0);
        return planePivot;
        
    });
    
    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
            }

            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            this.pickedObject = intersectedObjects[0].object;
            // save its color
            this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            // set its emissive color to flashing red/yellow
            this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            }
        }
    }

    const pickPosition = {x: 0, y: 0};
    const pickHelper = new PickHelper();
    clearPickPosition();


    
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

    function render(time) {
        time *= 0.001;  // convert to seconds;

        if (resizeRendererToDisplaySize(renderer)) {
            camera.right = canvas.width;
            camera.bottom = canvas.height;
            camera.updateProjectionMatrix();
        }

        //cameraPole.rotation.y = time * .1;

        pickHelper.pick(pickPosition, scene, camera, time);

        var mail_count = 0;
        for(var plane in planes){
            //console.log(planes[plane]);
            var now_name = mail_data[mail_count]["sender"];
            //console.log(min_time+", "+max_time+", "+width);
    
            const x = computeTimeLocation(mail_data[mail_count]["time"], min_time, max_time, width);
            const y = name_map[now_name].y; 
            planes[plane].position.set(x, y, 0);
            
           mail_count = mail_count + 1;
        }
    
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    
    function getCanvasRelativePosition(event) {
        // this get the client rectangle
        const rect = canvas.getBoundingClientRect();
        //console.log(rect);
        
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        
        pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
        console.log(pickPosition.x+", "+pickPosition.x);
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    //=====================================
    // event listener and call back functions
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



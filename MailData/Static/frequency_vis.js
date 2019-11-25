// Three.js - Cameras - Orthographic Canvas Top Left Origin
// from https://threejsfundamentals.org/threejs/threejs-cameras-orthographic-canvas-top-left-origin.html

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
//import * as THREE from './three.module.js';


export function frequency_vis(mail_data) {

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
    var [name_map, name_list]  =get_mail_node(mail_data, width, height);
    //console.log(name_map);
    //console.log(name_list);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const loader = new THREE.TextureLoader();

    function get_mail_node(mail_data, width, height){
        var name_map = {};
        var name_list = [];
        for (var key in mail_data) { 
            //console.log(mail_data[key]["sender"]);
            var sender_name = mail_data[key]["sender"];
            var receiver_names = mail_data[key]["receiver"];
            
            if(!(sender_name in name_map)){
                
                if(sender_name.includes("enron")){
                    var name_color = 0x467dff;
                }
                else{
                    var name_color = 0xff8246;
                }
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
            
            for(var receiver_name in receiver_names){
                
                if(!(receiver_names[receiver_name] in name_map)){
                    if(receiver_name.includes("enron")){
                        var name_color = 0x467dff;
                    }
                    else{
                        var name_color = 0xff8246;
                    }
                    var name_x = Math.floor(Math.random() * width);
                    var name_y = Math.floor(Math.random() * height);
                    var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": [] };

                    name_map[receiver_names[receiver_name]] = new_node;
                    name_list.push(receiver_names[receiver_name]);                               
                }

            }


        }
        return [name_map, name_list]
    }

    function randomColor(){
        var color_string = "0x"
        for(var color_index = 0; color_index <3; color_index++){
            var color_number = Math.floor(Math.random() * 240)+16;
            color_string = color_string + color_number.toString(16);

        }
        //console.log(color_string);
        //console.log(parseInt(color_string));
        var color_number = parseInt(color_string);
        return color_number
    }

    const planes = name_list.map((name) => {
        //console.log(name);
        //console.log(name_map[name]["end"].length)
        const planeSize = Math.floor(name_map[name]["end"].length/5);
        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planePivot = new THREE.Object3D();
        scene.add(planePivot);

        var new_color = randomColor();
        //console.log(typeof(0xa6f379))
        const planeMat = new THREE.MeshBasicMaterial( {color: new_color, side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        planePivot.add(mesh);
        // move plane so top left corner is origin
        //mesh.position.set(planeSize / 2, planeSize / 2, 0);
        return planePivot;

    });

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
    if (resizeRendererToDisplaySize(renderer)) {
        camera.right = canvas.width;
        camera.bottom = canvas.height;
        camera.updateProjectionMatrix();
    }

    var name_count = 0;
    for(var plane in planes){
        //console.log(planes[plane]);
        var now_name = name_list[name_count];

        const x = name_map[now_name].x;
        const y = name_map[now_name].y; 
        planes[plane].position.set(x, y, 0);
        
        name_count = name_count + 1;
    }
    renderer.render(scene, camera);

}
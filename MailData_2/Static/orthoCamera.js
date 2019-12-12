
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import Stats from './3rd_party/stats.module.js';
var container, stats;
var camera, scene, raycaster, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 500, theta = 0;
var frustumSize = 1000;
var viewport_width = 1000;
var viewport_height = 1000;
var G_cube_info ={};
var G_cube_position ={};
var G_cube_size =10;
var G_min_x = 0;
var G_max_x = 0;
var G_min_y = 0;
var G_max_y = 0;
var G_color_map = {};
var G_init_color_map = 0;

//init();
//animate();
export function init(renderType, datanode) {
	//console.log("TO SEE WHETHER THIS WORK?");
	
	var mail_data = datanode.original_data;
	var div = document.querySelector('#visualization_canvas');
	//var divOffset = offset(div);
	//console.log("DIV POSITION: "+ divOffset.left+", "+ divOffset.top);
	//console.log("Div width: "+div.offsetWidth+", div height:"+div.offsetHeight);
	//console.log(div);

	container = document.getElementById('visualization_canvas');
	//console.log(container);
	//document.body.appendChild( container );
	//console.log("window inner: "+ window.innerWidth+", "+window.innerHeight);
	var aspect = div.offsetWidth / div.offsetHeight;
	//console.log("aspect: "+aspect);

	camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
	//console.log("left: "+frustumSize * aspect / - 2+", right: "+frustumSize * aspect / 2);
	//console.log("top: "+frustumSize / 2+", bottom: "+frustumSize / -2);
	var min_x = frustumSize * aspect / - 2;
	var max_x = frustumSize * aspect / 2;
	var min_y = frustumSize / - 2;
	var max_y = frustumSize / 2;

	G_min_x = min_x;
	G_max_x = max_x;
	G_min_y = min_y;
	G_max_y = max_y;

	var [name_map, name_list, min_time, max_time]  = get_mail_node(mail_data, min_x, max_x, min_y, max_y);	
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	//light.position.set( 1, 1, 1 ).normalize();
	light.position.set( 0, 0, 1 ).normalize();
	scene.add( light );
	datanode.setScene(scene);
/*
	if(renderType == "timeline"){
		[G_cube_position, G_cube_info] = renderTimeline(datanode.scene, name_list, name_map, mail_data, min_time, max_time, min_x, max_x);
	}
	else if(renderType == "network"){
		renderNetwork(datanode.scene, name_list, name_map);
	}
	else if(renderType == "frequency"){
		[G_cube_position, G_cube_info] = renderFrequency(datanode.scenescene, name_list, name_map, mail_data, min_x, max_x, min_y, max_y);
	}
	else{
		console.log("render something else. "+datanode.drawType);
		[G_cube_position, G_cube_info] = renderTest(datanode.scene, min_x, max_x, min_y, max_y);

	}
*/
	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( div.offsetWidth, div.offsetHeight);
	container.appendChild( renderer.domElement );

	//stats = new Stats();
	//container.appendChild( stats.dom );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	//return scene;
}
export function renderData(datanode){

		init("test", datanode);
		animate();
		[G_cube_position, G_cube_info] = new_renderTimeline(datanode, G_min_x, G_max_x);



}

export function updateRender(datanode){
	clearScene(datanode.scene);
	datanode.scene.background = new THREE.Color( 0xf0f0f0 );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	//light.position.set( 1, 1, 1 ).normalize();
	light.position.set( 0, 0, 1 ).normalize();
	datanode.scene.add( light );
	
	if(datanode.drawType == "Timeline"){
		[G_cube_position, G_cube_info] = new_renderTimeline(datanode, G_min_x, G_max_x, G_max_y, G_min_y);
		//init("timeline", datanode);
		//animate();
	}
	else if(datanode.drawType == "Network"){
		//renderNetwork(scene, name_list, name_map);
		//init("network", datanode);
		//animate();
	}
	else if(datanode.drawType == "Stat"){
		//[G_cube_position, G_cube_info] = renderFrequency(scene, name_list, name_map, mail_data, min_x, max_x, min_y, max_y);
		//init("frequency", datanode);
		//animate();
	}
	else{
		console.log("render something else.");
		//init("test", datanode);
		//animate();
		[G_cube_position, G_cube_info] = renderTest(datanode.scene, G_min_x, G_max_x, G_min_y, G_max_y);
	}
	//animate();

}
function clearScene(scene){
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}
}
function renderTest(scene, min_x, max_x, min_y, max_y){
	console.log("render frequency");
    var cube_position = {};
	var cube_info = {}
	var testArray = [
		"3",
		"2",
		"1"
		
	];
	console.log("RENDERTEST: enter here");
    const cubes = testArray.map((test) => {
       // var people_name = name;

		var new_color = randomColor();
		//console.log(typeof(0xa6f379))
		const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
		const material = new THREE.MeshPhongMaterial({
			color: new_color,
		});
		const cube = new THREE.Mesh(geometry, material);
		//cubePivot.add(cube);
		var obj = JSON.parse(JSON.stringify(cube));
		scene.add(cube);

		var width = max_x - min_x;
		var height = max_y - min_y;
		//var cube_x = Math.floor(name_map[people_name].x);
		var cube_x = Math.floor(Math.random() * width -width/2);
		var cube_y = Math.floor(Math.random() * height -height/2);;
		var position_key = ""+cube_x+"_"+cube_y;
		cube_position[position_key] = obj["object"]["uuid"];
		cube_info[obj["object"]["uuid"]] = test;
		cube.position.set(cube_x, cube_y, -100);

		//cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
		//cube.rotation.set(0, 0, 0);
		cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
		//var ratio = name_map[people_name]["end"].length/mail_data.length *100
		//console.log(ratio);
		//cube.scale.set(ratio+ 0.5, ratio + 0.5, ratio + 0.5);
		//return cubePivot;
		return cube;

	})
	console.log(cube_position);
	console.log(cube_info);
	
	return [cube_position, cube_info]
}
function renderFrequency(scene, name_list, name_map, mail_data, min_x, max_x, min_y, max_y){
	console.log("render frequency");
    var cube_position = {};
    var cube_info = {}
    const cubes = name_list.map((name) => {
        var people_name = name;
		if(name_map[people_name]["end"].length > 0){
			var new_color = name_map[people_name]["color"];
			//console.log(typeof(0xa6f379))
			const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
			const material = new THREE.MeshPhongMaterial({
				color: new_color,
			});
			const cube = new THREE.Mesh(geometry, material);
			//cubePivot.add(cube);
			var obj = JSON.parse(JSON.stringify(cube));
			scene.add(cube);
	
			var width = max_x - min_x;
			var height = max_y - min_y;
			//var cube_x = Math.floor(name_map[people_name].x);
			var cube_x = Math.floor(Math.random() * width -width/2);
			var cube_y = Math.floor(Math.random() * height -height/2);;
			var position_key = ""+cube_x+"_"+cube_y;
			cube_position[position_key] = obj["object"]["uuid"];
			cube_info[obj["object"]["uuid"]] = name;
			cube.position.set(cube_x, cube_y, -100);
	
			//cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
			//cube.rotation.set(0, 0, 0);
			//cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
			var ratio = name_map[people_name]["end"].length/mail_data.length *100
			console.log(ratio);
			cube.scale.set(ratio+ 0.5, ratio + 0.5, ratio + 0.5);
			//return cubePivot;
			return cube;
		}
	})
	console.log(cube_position);
	console.log(cube_info);
	
	return [cube_position, cube_info]
}
function renderNetwork(scene, name_list, name_map){
	console.log("render network");
	var cube_position = {};
	var cube_info = {}


    const lines = name_list.map((name) => {
        //console.log(name);
        
        //console.log(name_map[name]);
        var sender = name;
        var linePivot_array = [];


        for(var end_node in name_map[name]["end"]){
            var receiver = name_map[name]["end"][end_node];

            const linePivot = new THREE.Object3D();
            scene.add(linePivot);
            var lineGeo = new THREE.Geometry();
            var lineMat = new THREE.LineBasicMaterial( { color: 0x000000 } );

            //console.log("("+name_map[sender].x+", "+name_map[sender].y+")");
            //console.log("("+name_map[receiver].x+", "+name_map[receiver].y+")");

            lineGeo.vertices.push(new THREE.Vector3( name_map[sender].x, name_map[sender].y, 0) );
            lineGeo.vertices.push(new THREE.Vector3(name_map[receiver].x, name_map[receiver].y, 0) );
            var line = new THREE.Line( lineGeo, lineMat );

            linePivot.add(line);
            linePivot_array.push(linePivot);
        }
        return linePivot_array
    });

    //console.log(lines);

    const planeSize = 5;
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);

    const planes = name_list.map((name) => {
        //console.log(name);
        const planePivot = new THREE.Object3D();
        scene.add(planePivot);

        //var new_color = name_map[name]["color"];
		if(name.includes("enron")){
			var name_color = 0x467dff;
		}
		else{
			var name_color = 0xff8246;
		}
		var new_color = name_color;
		//console.log(typeof(0xa6f379))
        const planeMat = new THREE.MeshBasicMaterial( {color: new_color, side: THREE.DoubleSide} );
		const mesh = new THREE.Mesh(planeGeo, planeMat);
		
		
        planePivot.add(mesh);
        // move plane so top left corner is origin
        //mesh.position.set(planeSize / 2, planeSize / 2, 0);
        return planePivot;

    });


	var name_count = 0;
    for(var plane in planes){
        //console.log(planes[plane]);
        var now_name = name_list[name_count];

        const x = name_map[now_name].x;
        const y = name_map[now_name].y; 
        planes[plane].position.set(x, y, 0);
        
        name_count = name_count + 1;
	}
	
	return [cube_position, cube_info]
}
function new_renderTimeline(datanode, min_x, max_x, max_y, min_y){
	var cube_position = {};
	var cube_info = {}
	var test_list = [];
	var width = max_x - min_x;
	var height = max_y - min_y;
	console.log(datanode.nowFilter)
	//console.log("start drawing");
	// min max
	var attribute_1 = datanode.chosenAttritube[0];
	// reference 1
	var attribute_2 = datanode.chosenAttritube[1];
	// refernce 2
	var attribute_3 = datanode.chosenAttritube[2];

	if(G_init_color_map == 0){
		// init color map
		var sender_count = 0 
		for(var item in datanode.nowFilter){
			for(var small_item in datanode.nowFilter[item]){


				var reference_name = datanode.nowFilter[item][small_item][attribute_2];
				if(!(reference_name in G_color_map)){

					var new_obj = {}
					new_obj["color"] = randomColor();
					//name_map[sender_name].x = -width/2;
					//name_map[sender_name].y = height/2 - Math.floor(sender_count *G_cube_size);				
					new_obj["x"] = -width/2;
					new_obj["y"] = height/2 - Math.floor(sender_count *G_cube_size);	
					
					G_color_map[reference_name] = new_obj;
					sender_count = sender_count + 1;
				}
				else{

				}
				

			}
		}
	}
	
	// process objects
	var div = document.querySelector('#visualization_canvas');

	// process timeline data
	var mail_count = 0;
	var mail_data = datanode.nowFilter;
	//const cubes = mail_data.map((mail) => {
	//console.log(datanode.nowFilter);
	var cubes = [];

	var array_count = 0;
	for(var index in datanode.nowFilter){
		var new_cubes = datanode.nowFilter[index].map((mail) => {
			var att2 = mail[attribute_2];
			// it is a list
			var att3 = mail[attribute_3];
	
			var new_color = G_color_map[att2]["color"];
			const geometry = new THREE.BoxBufferGeometry( G_cube_size, G_cube_size, G_cube_size );
			const material = new THREE.MeshPhongMaterial({
				color: new_color,
			});
			
	
			const cube = new THREE.Mesh(geometry, material);
			//cubePivot.add(cube);
			var obj = JSON.parse(JSON.stringify(cube));
			datanode.scene.add(cube);
	
	
			var cube_x = Math.floor(G_color_map[att2]["x"]);
			var cube_y = Math.floor(G_color_map[att2]["y"]);
			
			if(att3.length > 0){
				var cube_2_x = Math.floor(rand(0, 600));
				var cube_2_y = Math.floor(rand(0, 800));
				var position_key = ""+cube_x+"_"+cube_y+"_"+cube_2_x+"_"+cube_2_y;
		
			}
			else{
				var position_key = ""+cube_x+"_"+cube_y;
			}
			
			//var mail = mail_data[0];
			cube_position[position_key] = obj["object"]["uuid"];
			var mail_obj = JSON.parse(JSON.stringify(mail));
	
			cube_info[obj["object"]["uuid"]] ="time: "+mail_obj[attribute_1]+" from: "+mail_obj[attribute_2]+", to: "+mail_obj[attribute_3];
			

			// fix the coordinate shift
			var min_axis = datanode.keyRange[attribute_1]["min"];
			var max_axis = datanode.keyRange[attribute_1]["max"];
			
			const x = computeTimeLocation(mail[attribute_1], min_axis, max_axis, width) - width/2;
			const y = G_color_map[att2].y; 
		
			//console.log("sender at: "+y);
			cube.position.set(x, y, -100);
	
			return cube;
		});
		cubes[array_count] = new_cubes;
		array_count = array_count + 1;

	}


	return [cube_position, cube_info]

}
function renderTimeline(scene, name_list, name_map, mail_data, min_time, max_time, min_x, max_x){
	var cube_position = {};
	var cube_info = {}
	var test_list = [];
	
	// process objects
	var div = document.querySelector('#visualization_canvas');

	// process timeline data
	var mail_count = 0;
	//const cubes = mail_data.map((mail) => {
	const cubes = mail_data.map((mail) => {
        var sender_name = mail["sender"];
        // it is a list
        var receiver_name = mail["receiver"];
	
		//var sender_name = name;
		//console.log(name_map[name]);
		//var receiver_name = name_map[sender_name]["end"];
		//console.log(receiver_name[0]);
		//console.log(receiver_name);

        var new_color = name_map[sender_name]["color"];
        //console.log(typeof(0xa6f379))
		const geometry = new THREE.BoxBufferGeometry( G_cube_size, G_cube_size, G_cube_size );
		const material = new THREE.MeshPhongMaterial({
            color: new_color,
		});
		

        const cube = new THREE.Mesh(geometry, material);
        //cubePivot.add(cube);
        var obj = JSON.parse(JSON.stringify(cube));
        scene.add(cube);


        var cube_x = Math.floor(name_map[sender_name].x);
		var cube_y = Math.floor(name_map[sender_name].y);
		if(receiver_name.length > 0){
			var cube_2_x = Math.floor(name_map[receiver_name[0]].x);
			var cube_2_y = Math.floor(name_map[receiver_name[0]].y);
			var position_key = ""+cube_x+"_"+cube_y+"_"+cube_2_x+"_"+cube_2_y;
	
		}
		else{
			var position_key = ""+cube_x+"_"+cube_y;
		}
		//var mail = mail_data[0];
		//console.log(mail);
		cube_position[position_key] = obj["object"]["uuid"];
		var mail_obj = JSON.parse(JSON.stringify(mail));

		cube_info[obj["object"]["uuid"]] ="time: "+mail_obj["time"]+" from: "+mail_obj["sender"]+", to: "+mail_obj["receiver"];
		
		var width = max_x - min_x;
		// fix the coordinate shift

		const x = computeTimeLocation(mail["time"], min_time, max_time, width) - width/2;
		const y = name_map[sender_name].y; 
		//==cubes[cube].position.set(x, y, -100);		
		console.log("sender at: "+y);
		cube.position.set(x, y, -100);
        //cube.scale.set(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);

        //return cubePivot;
        return cube;
	});

	return [cube_position, cube_info]

}
function get_mail_node(mail_data, min_x, max_x, min_y, max_y){
	var name_map = {};
	var name_list = [];
	var min_time = 0;
	var max_time = 0;

	var sender_count = 0;
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

		var width = max_x - min_x;
		var height = max_y -min_y;
		console.log(height);
		// sender name
		if(!(sender_name in name_map)){
			
			var name_color = randomColor();
			var name_x = -width/2;
			var name_y = height/2 - Math.floor(sender_count *G_cube_size);;

			var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": receiver_names};
			sender_count = sender_count +1;
			name_map[sender_name] = new_node;
			//console.log("sender: "+sender_count + "x: "+name_map[sender_name].x+", y: "+name_map[sender_name].y);
			name_list.push(sender_name);
			for(var receiver_name in receiver_names){
				//console.log(receiver_names[receiver_name]);
                if(!(receiver_names[receiver_name] in name_map)){
					var name_color = randomColor();
					var name_x = Math.floor(Math.random() * width -width/2);
					var name_y = Math.floor(Math.random() * height- height/2);
					//var name_y = -(Math.floor( sender_count *G_cube_size- height/2));
                    var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": [] };

                    name_map[receiver_names[receiver_name]] = new_node;
                    name_list.push(receiver_names[receiver_name]);                               
				}	
			}			
			
		}
		else{
			//exist sender
			if(name_map[sender_name]["end"].length == 0){
				//empty sender
				name_map[sender_name].x = -width/2;
				name_map[sender_name].y = height/2 - Math.floor(sender_count *G_cube_size);
				sender_count = sender_count +1;
				//console.log("sender: "+sender_count + "x: "+name_map[sender_name].x+", y: "+name_map[sender_name].y);				
			}
			
			for(var receiver_name in receiver_names){
				//console.log(receiver_names[receiver_name]);
                if(!(receiver_names[receiver_name] in name_map)){
					var name_color = randomColor();
					var name_x = Math.floor(Math.random() * width -width/2);
					var name_y = Math.floor(Math.random() * height- height/2);
                    var new_node = {"x": name_x, "y": name_y, "color": name_color, "end": [] };
			        name_map[receiver_names[receiver_name]] = new_node;
                    name_list.push(receiver_names[receiver_name]);                               
				}

				
				if(!(receiver_names[receiver_name] in name_map[sender_name]["end"])){
					name_map[sender_name]["end"].push(receiver_names[receiver_name]);

				}
			
			}
		}



	}
	return [name_map, name_list, min_time, max_time]
}
function computeTimeLocation(current_time, min_time, max_time, width){

	//console.log("min: "+min_time+", max: "+max_time);

	var new_x = (current_time - min_time)/(max_time - min_time)*width;
	return new_x

}
function getPositionKey(isDoubleKey){
	return isDoubleKey
}
function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}
function rand(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return min + (max - min) * Math.random();
}
function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	//console.log("view port: "+viewportOffset.top+", "+viewportOffset.left);
	//console.log("rect position: "+rect.top+", "+rect.left);
	//console.log("scroll Top: "+scrollTop+", "+scrollLeft);
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
function onWindowResize() {
	var div = document.querySelector('#visualization_canvas');
	const canvas = div.getBoundingClientRect();	
	var aspect = div.offsetWidth / div.offsetHeight;
	camera.left = - frustumSize * aspect / 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = - frustumSize / 2;
	camera.updateProjectionMatrix();
	renderer.setSize( div.offsetWidth, div.offsetHeight );
}
function onDocumentMouseMove( event ) {
	event.preventDefault();

	var div = document.querySelector('#visualization_canvas');
	const canvas = div.getBoundingClientRect();
	var pos_x =event.clientX - canvas.left;
	var pos_y =event.clientY - canvas.top;
	mouse.x = (pos_x / div.offsetWidth ) * 2 - 1;
	mouse.y = -(pos_y / div.offsetHeight) * 2 + 1;  // note we flip Y
	// is the mouse real position in whole window
	//console.log(event.clientX+", "+event.clientY);
	//console.log("frame = "+ canvas.left+", " +canvas.top);
	//console.log("position = "+pos_x+", "+pos_y);
	//console.log("mouse position: "+mouse.x+", "+mouse.y);

}
export function animate() {
	//console.log("Does it keep going?");
	requestAnimationFrame( animate );
	render();
	//stats.update();
}
function render() {
	theta += 0.1;
	camera.lookAt( scene.position );
	camera.updateMatrixWorld();
	// find intersections
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		//console.log("is the recaster work?");


		if ( INTERSECTED != intersects[ 0 ].object ) {

			
			INTERSECTED = intersects[ 0 ].object;
			var obj = JSON.parse(JSON.stringify(INTERSECTED));
			//console.log(obj);
			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
			

			//console.log(G_cube_info[obj["object"]["uuid"]]);
	
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
			ctx.fillText(G_cube_info[obj["object"]["uuid"]], 10, 50);			
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
	}
	renderer.render( scene, camera );
}

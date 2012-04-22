const UP    = 0;
const DOWN  = 1;
const LEFT  = 2;
const RIGHT = 3;

var person = {x: 0.0, y: 15.0, rotateX: 0.0, rotateY: 0.0, rotateZ: 0.0};

$(function() {
	init();
});

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function walk(d) {
    person.x += 1.0 * d * Math.sin(degToRad(person.rotateZ));
    person.y += 1.0 * d * Math.cos(degToRad(person.rotateZ));

    if (person.x <= -8.0) {
	person.x = -8.0;
    }
    if (person.x >= 8.0) {
	person.x = 8.0;
    }
    if (person.y <= 15.0) {
	person.y = 15.0;
    }
    if (person.y >= 140.0) {
	person.y = 140.0;
    }
}

function turn(d) {
    person.rotateZ += d * 0.8;
}

function keyInput(e) {
    switch (e.keyCode) {
    case 37: // left
	turn(-1);
	break;
    case 38: // up
	walk(1);
	break;
    case 39: // right
	turn(1);
	break;
    case 40: // down
	walk(-1);
	break;
    }
}

var camera, scene, renderer,
    geometry, material, mesh;

function createPlane(size, position, rotation, surface) {
    geometry = new THREE.PlaneGeometry(size.w, size.h); // 立方体を作成

    material = new THREE.MeshBasicMaterial(surface);
    // material = new THREE.MeshLambertMaterial({map:texture});

    mesh = new THREE.Mesh(geometry,material); // 立方体と材質を結びつけてメッシュを作成
    mesh.position = position;
    mesh.rotation = rotation;

    return mesh;
}

var images = [
	      'white.png',
	      'image/r_1.jpg',
	      'image/r_2.jpg',
	      'image/r_3.jpg',
	      'image/r_4.jpg',
	      'image/r_5.jpg',
	      'image/r_6.jpg',
	      'image/r_7.jpg',
	      'image/r_8.jpg',
	      'image/r_9.jpg',
	      'image/r_10.jpg',
	      'image/r_11.jpg',
	      'image/r_12.jpg',
	      'image/r_13.jpg',
	      'image/r_14.jpg',
	      'image/r_15.jpg',
	      'image/r_16.jpg',
	      'image/r_17.jpg',
	      'image/r_18.jpg',
	      'image/r_19.jpg',
	      'image/r_20.jpg',
	      'image/r_21.jpg',
	      'image/r_22.jpg',
	      'image/r_23.jpg',
	      'image/r_24.jpg',
	      'image/r_25.jpg',
	      'image/r_26.jpg',
	      'image/r_27.jpg',
	      'image/r_28.jpg',
	      'image/r_29.jpg',
	      'image/r_30.jpg',
	      ];

function init() {

    var main = $("#main");
    var width = main.width();
    var height = width * 9.0 / 16.0;

    scene = new THREE.Scene(); // シーンを作成

    camera = new THREE.PerspectiveCamera(40,width/height,1,1000); // カメラを作成
    camera.position.z = -20; // カメラの位置はZ軸の-400
    camera.lookAt({x: 0, y: 0, z: 0});

    // 「DEPRECATED: Camera hasn't been added to a Scene. Adding it...」対策
    scene.add(camera);


    for (var i = 0; i < 15; i++) {
    	var image = 'image/r_' + (i+1) + '.jpg';
    	scene.add( createPlane(
    			       {w: 10.0, h: 10.0 },
    			       {x: 10, y: 0, z: 10*i+5 },
    			       {x: 0.5*Math.PI, y: 0, z: 0.5*Math.PI },
    			       {map: THREE.ImageUtils.loadTexture(image)}
    			       ) );
    }

    for (var i = 0; i < 15; i++) {
    	var image = 'image/r_' + (i+16) + '.jpg';
    	scene.add( createPlane(
    			       {w: 10.0, h: 10.0 },
    			       {x: -10, y: 0, z: 10*i+5 },
    			       {x: 0.5*Math.PI, y: 0, z: -0.5*Math.PI },
    			       {map: THREE.ImageUtils.loadTexture(image)}
    			       ) );
    }

    
    scene.add( createPlane(
    			   {w: 10.0, h: 10.0 },
    			   {x: -5, y: 0, z: 0},
    			   {x: 0.5*Math.PI, y: 0, z: 0},
    			   {color: 0xffffff}
    			   ) );
    scene.add( createPlane(
    			   {w: 10.0, h: 10.0 },
    			   {x: 5, y: 0, z: 0},
    			   {x: 0.5*Math.PI, y: 0, z: 0},
    			   {color: 0xffffff}
    			   ) );
    scene.add( createPlane(
    			   {w: 10.0, h: 10.0 },
    			   {x: -5, y: 0, z: 150},
    			   {x: -0.5*Math.PI, y: 0, z: 0},
    			   {color: 0xffffff}
    			   ) );
    scene.add( createPlane(
    			   {w: 10.0, h: 10.0 },
    			   {x: 5, y: 0, z: 150},
    			   {x: -0.5*Math.PI, y: 0, z: 0},
    			   {color: 0xffffff}
    			   ) );


    scene.add( createPlane(
    			   {w: 3.0, h: 3.0 },
    			   {x: 0, y: 0, z: 50},
    			   {x: -0.5*Math.PI, y: 0, z: 0},
    			   {map: THREE.ImageUtils.loadTexture('image/circle_green.png')}
    			   ) );

    // var light = new THREE.DirectionalLight(0xffffff,1.5); // 光源の色/強さ
    // light.position = {x:0,y:0.2,z:1}; // 光源の位置
    // scene.add(light);

    renderer = new THREE.WebGLRenderer(); // レンダラを作成
    renderer.setSize(width,height);

    main.append( renderer.domElement );

    $(window).keydown(keyInput);

    animate();
}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    render();

}

function render() {

    camera.position = { x: -person.x, y: 0, z: person.y };
    camera.rotation = { x: degToRad(person.rotateX) - Math.PI, y: degToRad(person.rotateZ), z: degToRad(person.rotateY) - Math.PI };

    renderer.render( scene, camera );

}


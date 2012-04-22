var kinect;
var iphone = {};
iphone.gravity_smooth_count = 0;
iphone.gravity_smooth_size = 10;
iphone.gravity_smooth_gx = 0.0;
iphone.gravity_smooth_gy = 0.0;
iphone.gravity_smooth_gz = 0.0;

iphone.compass_smooth_count = 0;
iphone.compass_smooth_size = 5;
iphone.compass_smooth_compass = 0.0;
    

$(function() {
    if ('io' in window) {
	webSocketStart();
    }
    else {
	$('#status').html('<p>Mode : StandAlone</p>');
    }
});

function parseKinectData(data) {
    if (kinect != undefined) {
	kinect.prevX = kinect.X;
	kinect.prevY = kinect.Y;
	kinect.prevZ = kinect.Z;
    }

    var array = data.split(',');

    if (kinect == undefined) {
	kinect = {};
	kinect.initX = parseInt(array[0]);
	kinect.initY = parseInt(array[1]);
	kinect.initZ = parseInt(array[2]);
    }
    kinect.X = array[0];
    kinect.Y = array[1];
    kinect.Z = array[2];

    var centerX = 720/2;
    var centerY = 480/2;

    // person.rotateZ = (kinect.X - centerX) / 2;
    // person.rotateX = (kinect.Y - centerY) / 2;

    person.y = 15.0 + (kinect.Z - kinect.initZ)/ 20;
	
    // $('#debug').html(person.rotateX + ' , ' + person.rotateZ + ' , ' + person.y);
}

function parseIphoneData(data) {
    var array = data.split(',');
    var type = array.shift();

    switch (type) {
    case 'gravity' :
	var gx = parseFloat(array[0]);
	var gy = parseFloat(array[1]);
	var gz = parseFloat(array[2]);

	if (iphone.gravity_smooth_count < iphone.gravity_smooth_size) {
	    iphone.gravity_smooth_count++;
	}
	else {
	    var alpha = 1 - 1/iphone.gravity_smooth_size;
	    iphone.gravity_smooth_gx *= alpha;
	    iphone.gravity_smooth_gy *= alpha;
	    iphone.gravity_smooth_gz *= alpha;
	}

	iphone.gravity_smooth_gx = ( (iphone.gravity_smooth_count - 1) * iphone.gravity_smooth_gx + gx) / iphone.gravity_smooth_count;
	iphone.gravity_smooth_gy = ( (iphone.gravity_smooth_count - 1) * iphone.gravity_smooth_gy + gy) / iphone.gravity_smooth_count;
	iphone.gravity_smooth_gz = ( (iphone.gravity_smooth_count - 1) * iphone.gravity_smooth_gz + gz) / iphone.gravity_smooth_count;

	gx = iphone.gravity_smooth_gx;
	gy = iphone.gravity_smooth_gy;
	gz = iphone.gravity_smooth_gz;

	person.rotateX = Math.floor(Math.atan2(gx, gz)/Math.PI*180);
	// person.rotateY = Math.floor(Math.atan2(gy, gx)/Math.PI*180);
	person.rotateY = - Math.floor(Math.atan2(gy, gz)/Math.PI*180);
	break;
    case 'compass' :
	var compass = parseFloat(array[0]);
	var accuracy = parseInt(array[1]);

	if (accuracy != -1) {

	    if (iphone.compassZero == undefined) {
		iphone.compassZero = compass;
	    }

	    compass = compass - iphone.compassZero;

	    if (iphone.compass_smooth_count < iphone.compass_smooth_size) {
		iphone.compass_smooth_count++;
	    }
	    else {
		var alpha = 1 - 1/iphone.compass_smooth_size;
		iphone.compass_smooth_compass *= alpha;
	    }


	    iphone.compass_smooth_compass = ( (iphone.compass_smooth_count - 1) * iphone.compass_smooth_compass + compass) / iphone.compass_smooth_count;

	    compass = iphone.compass_smooth_compass;

	    person.rotateZ = compass;
	}
	break;
    }	
    // $('#debug').html(person.rotateX+','+person.rotateY+','+person.rotateZ);
    
}

function parseSocketData(data) {
    var array = data.split(':');
    var header = array[0]

    switch (header) {
    case 'kinect' :
	parseKinectData(array[1]);
	break;
    case 'iphone' :
	parseIphoneData(array[1]);
	break;
    }
}

function webSocketStart() {
    var socket = io.connect('http://bookside.net:8000');

    socket.on('connect', function(msg) {
	$('#status').html(
	    // '<p>ConnectID : ' + socket.socket.transport.sessid + '</p>\n';
	    '<p>ConnectType : ' + socket.socket.transport.name + '</p>'
	);
    });

    socket.on('message', function(msg) {
	parseSocketData(msg.value);
    });

}
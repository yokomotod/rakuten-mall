var kinect;

$(function() {
    if ('io' in window) {
	webSocketStart();
    }
    else {
	$("#status").html("<p>Mode : StandAlone</p>");
    }
});

function parseKinectData(data) {

    if (kinect != undefined) {
	kinect.prevX = kinect.X;
	kinect.prevY = kinect.Y;
	kinect.prevZ = kinect.Z;
    }

    var array = data.split(",");
    if (kinect == undefined) {
	kinect = {};
	kinect.initX = array[0];
	kinect.initY = array[1];
	kinect.initZ = array[2];
    }
    kinect.X = array[0];
    kinect.Y = array[1];
    kinect.Z = array[2];

    var centerX = 720/2;
    var centerY = 480/2;

    person.rotateZ = (kinect.X - centerX) / 2;
    // person.rotateX = (kinect.Y - centerY) / 2;

    // person.y = 15.0 + (kinect.Z - kinect.initZ)/ 20;
	
    $("#debug").html(person.rotateX + " , " + person.rotateZ + " , " + person.y);
}

function webSocketStart() {
    var socket = io.connect('http://localhost:8000');

    socket.on('connect', function(msg) {
	$("#status").html(
	    // "<p>ConnectID : " + socket.socket.transport.sessid + "</p>\n";
	    "<p>ConnectType : " + socket.socket.transport.name + "</p>"
	);
    });

    socket.on('message', function(msg) {
	parseKinectData(msg.value);
    });

}
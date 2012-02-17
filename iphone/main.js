var socket;
window.onload = function() {
    window.addEventListener('devicemotion', function(e) {
	var gravity = e.accelerationIncludingGravity;
	var accele  = e.acceleration;
	var rotate  = e.rotationRate;
	document.getElementById("output1").innerHTML
	    = '<p>g.x : '+gravity.x+'</p>'
	    + '<p>g.y : '+gravity.y+'</p>'
	    + '<p>g.z : '+gravity.z+'</p>'
	    + '<br/>'
	    + '<p>a.x : '+accele.x+'</p>'
	    + '<p>a.y : '+accele.y+'</p>'
	    + '<p>a.z : '+accele.z+'</p>'
	    + '<br/>'
	    + '<p>r.x : '+rotate.alpha+'</p>'
	    + '<p>r.y : '+rotate.beta+'</p>'
	    + '<p>r.z : '+rotate.gamma+'</p>';

	if (socket != undefined) {
	    socket.emit('message', { value: 'iphone:'+'gravity,'+gravity.x+','+gravity.y+','+gravity.z });
	}
    });
    window.addEventListener('deviceorientation', function(e) {
	var compass = e.webkitCompassHeading;
	var accuracy = e.webkitCompassAccuracy;
	document.getElementById("output2").innerHTML
	    = '<p>compass : '+compass+'</p>'
	    + '<p>accuracy: '+accuracy+'</p>';
	if (socket != undefined) {
	    socket.emit('message', { value: 'iphone:'+'compass,'+compass+','+accuracy });
	}
    });

    if ('io' in window) {
	socket = io.connect('http://192.168.11.2:8000');

	socket.on('connect', function(msg) {
	    document.getElementById('status').innerHTML
		= "<p>ConnectID : " + socket.socket.transport.sessid + "</p>"
		+ "<p>ConnectType : " + socket.socket.transport.name + "</p>";
	});

    }
    else {
	alert("server not found.");
    }
};

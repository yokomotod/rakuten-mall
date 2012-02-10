$(function() {
    // $.ajax({
    // 	type: "GET",
    // 	url: "search.php",
    // 	dataType: "xml",
    // 	success: function(xml) {
    // 	    // $(xml).find("Item").each(function() {
    // 	    // 	var image_link = "<p><img src='" + $($(this).find("mediumImageUrl")).text() + "'></p>";
    // 	    // 	$("#main").append(image_link);
    // 	    // });
    // 	    var image_link = "<p><img src='" + $($($(xml).find("Item").first()).find("mediumImageUrl")).text() + "'></p>";
    // 	    $("#main").append(image_link);
    // 	},
    // })
   webGLStart();
});

var gl;

function initGL(canvas) {
    try {
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
    } catch (e) {
	alert(e);
    }
    if(!gl) {
	alert("Could not initialise WebGL, sorry :-(");
    }
}

// var vertexShaderSrc = "\
// attribute vec3 aVertexPosition;\n\
// attribute vec4 aVertexColor;\n\
// uniform mat4 uMVMatrix;\n\
// uniform mat4 uPMatrix;\n\
// varying vec4 vColor;\n\
// void main(void) { \n\
// gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
// vColor = aVertexColor; \n\
// } \n\
// ";
var vertexShaderSrc = "\
attribute vec3 aVertexPosition; \n\
attribute vec2 aTextureCoord; \n\
\n\
uniform mat4 uMVMatrix; \n\
uniform mat4 uPMatrix; \n\
\n\
varying vec2 vTextureCoord; \n\
\n\
\n\
void main(void) { \n\
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \n\
  vTextureCoord = aTextureCoord; \n\
} \n\
";

// var fragmentShaderSrc = "\
// precision mediump float; \n\
// varying vec4 vColor; \n\
// void main(void) { \n\
//   gl_FragColor = vColor; \n\
// } \n\
// ";
var fragmentShaderSrc = "\
precision mediump float; \n\
\n\
varying vec2 vTextureCoord; \n\
\n\
uniform sampler2D uSampler; \n\
\n\
void main(void) { \n\
  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \n\
} \n\
";

var shaderProgram;

function initShaders() {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSrc);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(vertexShader));
	return null;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSrc);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	alert(gl.getShaderInfoLog(fragmentShader));
	return null;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    // gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var texture;

function initTexture() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
    	handleLoadedTexture(texture)
    }
    texture.image.src = 'image/2.gif';

    // neheTexture = gl.createTexture();
    // neheTexture.image = new Image();
    // neheTexture.image.onload = function () {
    // 	handleLoadedTexture(neheTexture)
    // }
    // neheTexture.image.src = "nehe.gif";
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
	throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var squareVertexPositionBuffer;
var squareVertexColorBuffer;
var squareVertexTextureCoordBuffer;
var squareVertexIndexBuffer;

function initBuffers() {
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        // Front face
	    -1.0, -1.0,  1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0,  1.0,
	    -1.0,  1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;

    // squareVertexColorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    // colors = []
    // for (var i=0; i < 4; i++) {
    // 	colors = colors.concat([1.0, 1.0, 1.0, 1.0]);
    // }
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // squareVertexColorBuffer.itemSize = 4;
    // squareVertexColorBuffer.numItems = 4;

    squareVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
    var textureCoords = [
    	0.0, 0.0,
    	1.0, 0.0,
    	1.0, 1.0,
    	0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    squareVertexTextureCoordBuffer.itemSize = 2;
    squareVertexTextureCoordBuffer.numItems = 4;

    squareVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
        var squareVertexIndices = [
	    0, 1, 2,      0, 2, 3,
	];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
    squareVertexIndexBuffer.itemSize = 1;
    squareVertexIndexBuffer.numItems = 6;
}



function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    // gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // setMatrixUniforms();
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}
    
function webGLStart() {
    var canvas = document.getElementById("canvas");
    // var canvas = $("#canvas"); cause error!
    initGL(canvas);
    initShaders();
    initBuffers();
    initTexture();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);


    setInterval(drawScene, 20);
}

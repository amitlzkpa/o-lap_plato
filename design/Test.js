	




var Design = {};

Design.info = {
	"name": "Test",
	"designer": "Amit Nambiar",
	"version": "1.0.0",
	"license": "MIT",
	"short_desc": "Test design.",
	"long_desc": "",
	"url": null,
	"message": null,
	"tags": [ "", "" ]
}



Design.inputs = {


	"width": { 
		"type": "slider",
		"label": "Width",
		"default": 600,
		"min": 500,
		"max": 900
	},
	"breadth": { 
		"type": "slider",
		"label": "Breadth",
		"default": 700,
		"min": 100,
		"max": 800
	}


}



Design.inputState = {}



var matLine_black = new THREE.LineBasicMaterial({ linewidth: 80, color: 0x000000, linecap: 'round', linejoin:  'round' });
var matLine_white = new THREE.LineBasicMaterial({ linewidth: 80, color: 0xffffff, linecap: 'round', linejoin:  'round' });
var matMesh_debug = new THREE.MeshNormalMaterial( { side: THREE.DoubleSide, wireframe: false, flatShading: THREE.SmoothShading, transparent: true, opacity: 0.4 });

var matMesh_red = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, color: 0xd32f2f } );
var matMesh_blue = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, color: 0x01579b } );
var matMesh_green = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, color: 0x33691e } );
var matMesh_wirewhite = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );


function map_range(value, low1, high1, low2, high2, interp="lin") {
	var val = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    return val;
}






var activeMat = matMesh_red;
var instance = null;



Design.init = async function() {
}



Design.updateGeom = async function(group, sliceManager) {


	if (instance == null) {
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		instance = new THREE.Mesh( geometry, activeMat );
		instance.scale.y = 600;
		scene.add(instance);
	}

	sliceManager.addSliceSet({uDir: true, start: -200, end: 200, cuts: 1});
	// sliceManager.addSliceSet({uDir: false, start: -300, end: 300, cuts: 2});

	instance.scale.x = Design.inputState.width;
	instance.scale.z = Design.inputState.breadth;


}




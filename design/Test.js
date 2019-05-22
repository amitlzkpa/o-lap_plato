	




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
// var instance = null;




Design.init = async function() {
}











// no nested meshes
// no nested object3d


// THREE.Object3D(objectContainer) 
// 	THREE.Object3D
// 		THREE.Mesh
// 	THREE.Object3D
// 		THREE.Mesh
// 	THREE.Object3D
// 		THREE.Mesh


Design.updateGeom = async function(objectContainer, sliceManager) {


	let g1, g2, g3;
	let instance = new THREE.Object3D();

	g1 = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), matMesh_debug );
	instance.add(g1);
	// g2 = new THREE.Mesh( new THREE.BoxGeometry( 1.8, 1.4, 0.3 ), matMesh_green );
	// instance.add(g2);
	// g3 = new THREE.Mesh( new THREE.SphereGeometry( 0.4, 64, 64 ), matMesh_blue );
	// g3.position.x = -0.2;
	// g3.position.z = 1;
	// instance.add(g3);

	instance = instance;
	instance.scale.y = 600;
	objectContainer.add(instance);

	sliceManager.addSliceSet({uDir: true, start: -20, end: 200, cuts: 1});
	// sliceManager.addSliceSet({uDir: false, start: -300, end: 300, cuts: 3});

	instance.scale.x = parseInt(Design.inputState.width);
	instance.scale.z = parseInt(Design.inputState.breadth);


	// console.log("Test.js --->");

	// console.log(instance);

	// console.log("<-- Test.js");

}




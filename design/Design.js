	




var Design = {};

Design.info = {
	"name": "Plato",
	"designer": "Amit Nambiar",
	"version": "1.0.1",
	"license": "MIT",
	"short_desc": "A single seater for your gaming sessions.",
	"long_desc": "",
	"url": null,
	"message": null,
	"tags": [ "", "" ]
}



Design.inputs = {


	"age": { 
		"type": "slider",
		"label": "Age",
		"default": 24,
		"min": 12,
		"max": 60
	},
	"weight": { 
		"type": "slider",
		"label": "Weight(in kg)",
		"default": 65,
		"min": 30,
		"max": 200
	},
	"high-back": {
		"type": "bool",
		"label": "High-back",
		"default": false
	},
	"colour": {
		"type": "select",
		"label": "Colour",
		"default": "red",
		"choices": ["Red", "Blue", "Green"]
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



// http://www.wolframalpha.com/examples/math/algebra/polynomials/
// quadratic functions

// 30 -> 1	|	60 -> 1.02	|	120 -> 1.2		|	150 -> 1.4
function getWeightMul(wt) {
	return (0.0000333333 * Math.pow(wt, 2)) - (0.00273333 * wt) + 1.056;
}


// 12 -> 0.6	|	30 -> 0.9	|	50 -> 1		|	60 -> 0.95
function getAgeMul(age) {
	return (-0.000315247 * (Math.pow(age, 2))) + (0.0300255 * age) + 0.284562
}



var w_mul = 1;
var w_innerMul = 1;
var w_outerMul = 1.7;

var add_highback_y = 0;
var add_highback_z = 0;

var add_weight_out_y = 0;
var add_weight_in_y = 0;

var add_age_z = 0;

var activeMat = matMesh_red;


async function updatePts() {

	// age alterations - scale the whole design by a factor depending on age
	var age = Design.inputState.age;
	var agemin = Design.inputs.age.min;
	var agemax = Design.inputs.age.max;
	// scale factor is non-linear and follows a quadratic curve
	var sc = getAgeMul(age);

	// scale all points by value
	i_bs_pts.forEach((d, i) => { d[0] = i_bs_pts_start[i][0] * sc; d[1] = i_bs_pts_start[i][1] * sc; d[2] = i_bs_pts_start[i][2] * sc; });
	i_bk_pts.forEach((d, i) => { d[0] = i_bk_pts_start[i][0] * sc; d[1] = i_bk_pts_start[i][1] * sc; d[2] = i_bk_pts_start[i][2] * sc; });
	i_tp_pts.forEach((d, i) => { d[0] = i_tp_pts_start[i][0] * sc; d[1] = i_tp_pts_start[i][1] * sc; d[2] = i_tp_pts_start[i][2] * sc; });
	i_st_pts.forEach((d, i) => { d[0] = i_st_pts_start[i][0] * sc; d[1] = i_st_pts_start[i][1] * sc; d[2] = i_st_pts_start[i][2] * sc; });
	i_ft_pts.forEach((d, i) => { d[0] = i_ft_pts_start[i][0] * sc; d[1] = i_ft_pts_start[i][1] * sc; d[2] = i_ft_pts_start[i][2] * sc; });

	o_bs_pts.forEach((d, i) => { d[0] = o_bs_pts_start[i][0] * sc; d[1] = o_bs_pts_start[i][1] * sc; d[2] = o_bs_pts_start[i][2] * sc; });
	o_bk_pts.forEach((d, i) => { d[0] = o_bk_pts_start[i][0] * sc; d[1] = o_bk_pts_start[i][1] * sc; d[2] = o_bk_pts_start[i][2] * sc; });
	o_tp_pts.forEach((d, i) => { d[0] = o_tp_pts_start[i][0] * sc; d[1] = o_tp_pts_start[i][1] * sc; d[2] = o_tp_pts_start[i][2] * sc; });
	o_st_pts.forEach((d, i) => { d[0] = o_st_pts_start[i][0] * sc; d[1] = o_st_pts_start[i][1] * sc; d[2] = o_st_pts_start[i][2] * sc; });
	o_ft_pts.forEach((d, i) => { d[0] = o_ft_pts_start[i][0] * sc; d[1] = o_ft_pts_start[i][1] * sc; d[2] = o_ft_pts_start[i][2] * sc; });

	i_bs_pts_mirr.forEach((d, i) => { d[0] = i_bs_pts_mirr_start[i][0] * sc; d[1] = i_bs_pts_mirr_start[i][1] * sc; d[2] = i_bs_pts_mirr_start[i][2] * sc; });
	i_bk_pts_mirr.forEach((d, i) => { d[0] = i_bk_pts_mirr_start[i][0] * sc; d[1] = i_bk_pts_mirr_start[i][1] * sc; d[2] = i_bk_pts_mirr_start[i][2] * sc; });
	i_tp_pts_mirr.forEach((d, i) => { d[0] = i_tp_pts_mirr_start[i][0] * sc; d[1] = i_tp_pts_mirr_start[i][1] * sc; d[2] = i_tp_pts_mirr_start[i][2] * sc; });
	i_st_pts_mirr.forEach((d, i) => { d[0] = i_st_pts_mirr_start[i][0] * sc; d[1] = i_st_pts_mirr_start[i][1] * sc; d[2] = i_st_pts_mirr_start[i][2] * sc; });
	i_ft_pts_mirr.forEach((d, i) => { d[0] = i_ft_pts_mirr_start[i][0] * sc; d[1] = i_ft_pts_mirr_start[i][1] * sc; d[2] = i_ft_pts_mirr_start[i][2] * sc; });

	o_bs_pts_mirr.forEach((d, i) => { d[0] = o_bs_pts_mirr_start[i][0] * sc; d[1] = o_bs_pts_mirr_start[i][1] * sc; d[2] = o_bs_pts_mirr_start[i][2] * sc; });
	o_bk_pts_mirr.forEach((d, i) => { d[0] = o_bk_pts_mirr_start[i][0] * sc; d[1] = o_bk_pts_mirr_start[i][1] * sc; d[2] = o_bk_pts_mirr_start[i][2] * sc; });
	o_tp_pts_mirr.forEach((d, i) => { d[0] = o_tp_pts_mirr_start[i][0] * sc; d[1] = o_tp_pts_mirr_start[i][1] * sc; d[2] = o_tp_pts_mirr_start[i][2] * sc; });
	o_st_pts_mirr.forEach((d, i) => { d[0] = o_st_pts_mirr_start[i][0] * sc; d[1] = o_st_pts_mirr_start[i][1] * sc; d[2] = o_st_pts_mirr_start[i][2] * sc; });
	o_ft_pts_mirr.forEach((d, i) => { d[0] = o_ft_pts_mirr_start[i][0] * sc; d[1] = o_ft_pts_mirr_start[i][1] * sc; d[2] = o_ft_pts_mirr_start[i][2] * sc; });



	// high-back alterations - move certain parts of base, back, top and seat curve backwards and upwards
	// (move it back to avoid the feeling of sitting against a vertical wall) 
	add_highback_y = Design.inputState["high-back"] ? 120 : 0;
	add_highback_z = Design.inputState["high-back"] ? 40 : 0;

	add_weight_out_y = map_range(Design.inputState["weight"], Design.inputs.weight.min, Design.inputs.weight.max, 0, 90);
	add_weight_in_y = map_range(Design.inputState["weight"], Design.inputs.weight.min, Design.inputs.weight.max, 0, 60);

	add_age_z = map_range(Design.inputState["age"], Design.inputs.age.min, Design.inputs.age.max, 0, 80);

	// move end of base-curve back to give more grounding
	i_bs_pts[0][2] -= add_age_z;
	o_bs_pts[0][2] -= add_age_z;
	i_bs_pts[2][2] += add_highback_z;
	o_bs_pts[2][2] += add_highback_z;
	i_bs_pts_mirr[0][2] -= add_age_z;
	o_bs_pts_mirr[0][2] -= add_age_z;
	i_bs_pts_mirr[2][2] += add_highback_z;
	o_bs_pts_mirr[2][2] += add_highback_z;
	i_bk_pts[0][2] += add_highback_z;
	o_bk_pts[0][2] += add_highback_z;
	i_bk_pts_mirr[0][2] += add_highback_z;
	o_bk_pts_mirr[0][2] += add_highback_z;

	// move back curve up and back
	i_bk_pts[1][1] += add_highback_y + add_weight_in_y; i_bk_pts[1][2] += add_highback_z;
	i_bk_pts[2][1] += add_highback_y + add_weight_in_y; i_bk_pts[2][2] += add_highback_z;
	o_bk_pts[1][1] += add_highback_y + add_weight_out_y; o_bk_pts[1][2] += add_highback_z;
	o_bk_pts[2][1] += add_highback_y + add_weight_out_y; o_bk_pts[2][2] += add_highback_z;
	i_bk_pts_mirr[1][1] += add_highback_y + add_weight_in_y; i_bk_pts_mirr[1][2] += add_highback_z;
	i_bk_pts_mirr[2][1] += add_highback_y + add_weight_in_y; i_bk_pts_mirr[2][2] += add_highback_z;
	o_bk_pts_mirr[1][1] += add_highback_y + add_weight_out_y; o_bk_pts_mirr[1][2] += add_highback_z;
	o_bk_pts_mirr[2][1] += add_highback_y + add_weight_out_y; o_bk_pts_mirr[2][2] += add_highback_z;

	// move top-curve full up and back
	i_tp_pts[0][1] += add_highback_y + add_weight_in_y; i_tp_pts[0][2] += add_highback_z;
	i_tp_pts[1][1] += add_highback_y + add_weight_in_y; i_tp_pts[1][2] += add_highback_z;
	i_tp_pts[2][1] += add_highback_y + add_weight_in_y; i_tp_pts[2][2] += add_highback_z;
	o_tp_pts[0][1] += add_highback_y + add_weight_out_y; o_tp_pts[0][2] += add_highback_z;
	o_tp_pts[1][1] += add_highback_y + add_weight_out_y; o_tp_pts[1][2] += add_highback_z;
	o_tp_pts[2][1] += add_highback_y + add_weight_out_y; o_tp_pts[2][2] += add_highback_z;
	i_tp_pts_mirr[0][1] += add_highback_y + add_weight_in_y; i_tp_pts_mirr[0][2] += add_highback_z;
	i_tp_pts_mirr[1][1] += add_highback_y + add_weight_in_y; i_tp_pts_mirr[1][2] += add_highback_z;
	i_tp_pts_mirr[2][1] += add_highback_y + add_weight_in_y; i_tp_pts_mirr[2][2] += add_highback_z;
	o_tp_pts_mirr[0][1] += add_highback_y + add_weight_out_y; o_tp_pts_mirr[0][2] += add_highback_z;
	o_tp_pts_mirr[1][1] += add_highback_y + add_weight_out_y; o_tp_pts_mirr[1][2] += add_highback_z;
	o_tp_pts_mirr[2][1] += add_highback_y + add_weight_out_y; o_tp_pts_mirr[2][2] += add_highback_z;

	// move only top of seat curve up and back
	i_st_pts[0][1] += add_highback_y + add_weight_in_y; i_st_pts[0][2] += add_highback_z;
	o_st_pts[0][1] += add_highback_y + add_weight_out_y; o_st_pts[0][2] += add_highback_z;
	i_st_pts_mirr[0][1] += add_highback_y + add_weight_in_y; i_st_pts_mirr[0][2] += add_highback_z;
	o_st_pts_mirr[0][1] += add_highback_y + add_weight_out_y; o_st_pts_mirr[0][2] += add_highback_z;

	i_st_pts[2][2] -= add_age_z;
	o_st_pts[2][2] -= add_age_z;
	i_st_pts_mirr[2][2] -= add_age_z;
	o_st_pts_mirr[2][2] -= add_age_z;

	i_ft_pts[0][2] -= add_age_z; i_ft_pts[1][2] -= add_age_z; i_ft_pts[2][2] -= add_age_z;
	o_ft_pts[0][2] -= add_age_z; o_ft_pts[1][2] -= add_age_z; o_ft_pts[2][2] -= add_age_z;
	i_ft_pts_mirr[0][2] -= add_age_z; i_ft_pts_mirr[1][2] -= add_age_z; i_ft_pts_mirr[2][2] -= add_age_z;
	o_ft_pts_mirr[0][2] -= add_age_z; o_ft_pts_mirr[1][2] -= add_age_z; o_ft_pts_mirr[2][2] -= add_age_z;



	// weight alterations - alters the width of the chair and sink
	var wt = Design.inputState.weight;
	var wtMin = Design.inputs.weight.min;
	var wtMax = Design.inputs.weight.max;
	// dispalcement factor is non-linear and follows a quadratic curve
	var w_mul = getWeightMul(wt);
	var innerX = i_bs_pts[0][0] * w_mul * w_innerMul;
	var outerX = i_bs_pts[0][0] * w_mul * w_outerMul;

	i_bs_pts.forEach(d => d[0] = innerX);
	i_bk_pts.forEach(d => d[0] = innerX);
	i_tp_pts.forEach(d => d[0] = innerX);
	i_st_pts.forEach(d => d[0] = innerX);
	i_ft_pts.forEach(d => d[0] = innerX);

	o_bs_pts.forEach(d => d[0] = outerX);
	o_bk_pts.forEach(d => d[0] = outerX);
	o_tp_pts.forEach(d => d[0] = outerX);
	o_st_pts.forEach(d => d[0] = outerX);
	o_ft_pts.forEach(d => d[0] = outerX);

	i_bs_pts_mirr.forEach(d => d[0] = -innerX);
	i_bk_pts_mirr.forEach(d => d[0] = -innerX);
	i_tp_pts_mirr.forEach(d => d[0] = -innerX);
	i_st_pts_mirr.forEach(d => d[0] = -innerX);
	i_ft_pts_mirr.forEach(d => d[0] = -innerX);

	o_bs_pts_mirr.forEach(d => d[0] = -outerX);
	o_bk_pts_mirr.forEach(d => d[0] = -outerX);
	o_tp_pts_mirr.forEach(d => d[0] = -outerX);
	o_st_pts_mirr.forEach(d => d[0] = -outerX);
	o_ft_pts_mirr.forEach(d => d[0] = -outerX);

}



//-----------------------------------------------------------



// inner profile
var i_bs_pts_start = [ 		[200, 0, 0], 		[200, 0, 252], 		[200, 0, 605] 		];
var i_bk_pts_start = [ 		[200, 0, 605], 		[200, 400, 720], 	[200, 852, 716] 	];
var i_tp_pts_start = [		[200, 852, 716], 	[200, 920, 627], 	[200, 860, 552] 	];
var i_st_pts_start = [		[200, 860, 552], 	[200, 485, 366], 	[200, 496, 14]		];
var i_ft_pts_start = [		[200, 496, 14], 	[200, 456, -63],	[200, 0, 0]			];


// outer profile
var o_bs_pts_start = [		[360, 0, 0], 		[360, 0, 240],		[360, 0, 530]		];
var o_bk_pts_start = [		[360, 0, 530],		[360, 540, 660],	[360, 907, 640]		];
var o_tp_pts_start = [		[360, 907, 640],	[360, 965, 570],	[360, 907, 510]		];
var o_st_pts_start = [		[360, 907, 510],	[360, 503, 330],	[360, 520, 13]		];
var o_ft_pts_start = [		[360, 520, 13],		[360, 405, -75],	[360, 0, 0]			];



var i_bs_pts_mirr_start = [ 	[-200, 0, 0], 		[-200, 0, 252], 	[-200, 0, 605] 		];
var i_bk_pts_mirr_start = [ 	[-200, 0, 605], 	[-200, 400, 720], 	[-200, 852, 716] 	];
var i_tp_pts_mirr_start = [		[-200, 852, 716], 	[-200, 920, 627], 	[-200, 860, 552] 	];
var i_st_pts_mirr_start = [		[-200, 860, 552], 	[-200, 485, 366], 	[-200, 496, 14]		];
var i_ft_pts_mirr_start = [		[-200, 496, 14], 	[-200, 456, -63],	[-200, 0, 0]		];


var o_bs_pts_mirr_start = [		[-360, 0, 0], 		[-360, 0, 240],		[-360, 0, 530]		];
var o_bk_pts_mirr_start = [		[-360, 0, 530],		[-360, 540, 660],	[-360, 907, 640]	];
var o_tp_pts_mirr_start = [		[-360, 907, 640],	[-360, 965, 570],	[-360, 907, 510]	];
var o_st_pts_mirr_start = [		[-360, 907, 510],	[-360, 503, 330],	[-360, 520, 13]		];
var o_ft_pts_mirr_start = [		[-360, 520, 13],	[-360, 405, -75],	[-360, 0, 0]		];



//-----------------------------------------------------------



// inner profile
var i_bs_pts = JSON.parse(JSON.stringify(i_bs_pts_start));
var i_bk_pts = JSON.parse(JSON.stringify(i_bk_pts_start));
var i_tp_pts = JSON.parse(JSON.stringify(i_tp_pts_start));
var i_st_pts = JSON.parse(JSON.stringify(i_st_pts_start));
var i_ft_pts = JSON.parse(JSON.stringify(i_ft_pts_start));


// outer profile
var o_bs_pts = JSON.parse(JSON.stringify(o_bs_pts_start));
var o_bk_pts = JSON.parse(JSON.stringify(o_bk_pts_start));
var o_tp_pts = JSON.parse(JSON.stringify(o_tp_pts_start));
var o_st_pts = JSON.parse(JSON.stringify(o_st_pts_start));
var o_ft_pts = JSON.parse(JSON.stringify(o_ft_pts_start));



var i_bs_pts_mirr =JSON.parse(JSON.stringify(i_bs_pts_mirr_start));
var i_bk_pts_mirr = JSON.parse(JSON.stringify(i_bk_pts_mirr_start));
var i_tp_pts_mirr = JSON.parse(JSON.stringify(i_tp_pts_mirr_start));
var i_st_pts_mirr = JSON.parse(JSON.stringify(i_st_pts_mirr_start));
var i_ft_pts_mirr = JSON.parse(JSON.stringify(i_ft_pts_mirr_start));


var o_bs_pts_mirr = JSON.parse(JSON.stringify(o_bs_pts_mirr_start));
var o_bk_pts_mirr = JSON.parse(JSON.stringify(o_bk_pts_mirr_start));
var o_tp_pts_mirr = JSON.parse(JSON.stringify(o_tp_pts_mirr_start));
var o_st_pts_mirr = JSON.parse(JSON.stringify(o_st_pts_mirr_start));
var o_ft_pts_mirr = JSON.parse(JSON.stringify(o_ft_pts_mirr_start));








Design.init = async function() {
}



Design.updateGeom = async function(group, sliceManager) {


	if (this.inputState.colour == "Red") activeMat = matMesh_red;
	if (this.inputState.colour == "Blue") activeMat = matMesh_blue;
	if (this.inputState.colour == "Green") activeMat = matMesh_green;
	await updatePts();


	var obj = new THREE.Object3D();


	// add curves
	var i_bs = verb.geom.NurbsCurve.byPoints( i_bs_pts, 2 );
	var i_bk = verb.geom.NurbsCurve.byPoints( i_bk_pts, 2 );
	var i_tp = verb.geom.NurbsCurve.byPoints( i_tp_pts, 2 );
	var i_st = verb.geom.NurbsCurve.byPoints( i_st_pts, 2 );
	var i_ft = verb.geom.NurbsCurve.byPoints( i_ft_pts, 2 );

	var o_bs = verb.geom.NurbsCurve.byPoints( o_bs_pts, 2 );
	var o_bk = verb.geom.NurbsCurve.byPoints( o_bk_pts, 2 );
	var o_tp = verb.geom.NurbsCurve.byPoints( o_tp_pts, 2 );
	var o_st = verb.geom.NurbsCurve.byPoints( o_st_pts, 2 );
	var o_ft = verb.geom.NurbsCurve.byPoints( o_ft_pts, 2 );

	var i_bs_mirr = verb.geom.NurbsCurve.byPoints( i_bs_pts_mirr, 2 );
	var i_bk_mirr = verb.geom.NurbsCurve.byPoints( i_bk_pts_mirr, 2 );
	var i_tp_mirr = verb.geom.NurbsCurve.byPoints( i_tp_pts_mirr, 2 );
	var i_st_mirr = verb.geom.NurbsCurve.byPoints( i_st_pts_mirr, 2 );
	var i_ft_mirr = verb.geom.NurbsCurve.byPoints( i_ft_pts_mirr, 2 );

	var o_bs_mirr = verb.geom.NurbsCurve.byPoints( o_bs_pts_mirr, 2 );
	var o_bk_mirr = verb.geom.NurbsCurve.byPoints( o_bk_pts_mirr, 2 );
	var o_tp_mirr = verb.geom.NurbsCurve.byPoints( o_tp_pts_mirr, 2 );
	var o_st_mirr = verb.geom.NurbsCurve.byPoints( o_st_pts_mirr, 2 );
	var o_ft_mirr = verb.geom.NurbsCurve.byPoints( o_ft_pts_mirr, 2 );

	// obj.add(new THREE.Line( i_bs.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_bk.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_tp.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_st.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_ft.toThreeGeometry(), matLine_black ));

	// obj.add(new THREE.Line( o_bs.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_bk.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_tp.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_st.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_ft.toThreeGeometry(), matLine_black ));

	// obj.add(new THREE.Line( i_bs_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_bk_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_tp_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_st_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( i_ft_mirr.toThreeGeometry(), matLine_black ));

	// obj.add(new THREE.Line( o_bs_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_bk_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_tp_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_st_mirr.toThreeGeometry(), matLine_black ));
	// obj.add(new THREE.Line( o_ft_mirr.toThreeGeometry(), matLine_black ));


	// add surfaces
	var bs_crv, bk_crv, tp_crv, st_crv, ft_crv;

	var o_bk_crv = verb.geom.NurbsCurve.byPoints( o_bk_pts, 2 );
	var o_tp_crv = verb.geom.NurbsCurve.byPoints( o_tp_pts, 2 );
	var o_st_crv = verb.geom.NurbsCurve.byPoints( o_st_pts, 2 );
	var o_ft_crv = verb.geom.NurbsCurve.byPoints( o_ft_pts, 2 );

	bs_crv = 	[
					verb.geom.NurbsCurve.byPoints( o_bs_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_bs_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_bs_pts_mirr, 2 ),
					verb.geom.NurbsCurve.byPoints( o_bs_pts_mirr, 2 )
				];
	var srf_bs = verb.geom.NurbsSurface.byLoftingCurves( bs_crv, 2 );

	bk_crv = 	[
					o_bk_crv,
					verb.geom.NurbsCurve.byPoints( i_bk_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_bk_pts_mirr, 2 ),
					verb.geom.NurbsCurve.byPoints( o_bk_pts_mirr, 2 )
				];
	var srf_bk = verb.geom.NurbsSurface.byLoftingCurves( bk_crv, 2 );

	tp_crv = 	[
					o_tp_crv,
					verb.geom.NurbsCurve.byPoints( i_tp_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_tp_pts_mirr, 2 ),
					verb.geom.NurbsCurve.byPoints( o_tp_pts_mirr, 2 )
				];
	var srf_tp = verb.geom.NurbsSurface.byLoftingCurves( tp_crv, 2 );

	st_crv = 	[
					o_st_crv,
					verb.geom.NurbsCurve.byPoints( i_st_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_st_pts_mirr, 2 ),
					verb.geom.NurbsCurve.byPoints( o_st_pts_mirr, 2 )
				];
	var srf_st = verb.geom.NurbsSurface.byLoftingCurves( st_crv, 2 );

	ft_crv = 	[
					o_ft_crv,
					verb.geom.NurbsCurve.byPoints( i_ft_pts, 2 ),
					verb.geom.NurbsCurve.byPoints( i_ft_pts_mirr, 2 ),
					verb.geom.NurbsCurve.byPoints( o_ft_pts_mirr, 2 )
				];
	var srf_ft = verb.geom.NurbsSurface.byLoftingCurves( ft_crv, 2 );



	let backmesh = new THREE.Mesh( srf_bk.toThreeGeometry(), activeMat );
	obj.add(new THREE.Mesh( srf_bs.toThreeGeometry(), activeMat ));
	// backmesh.dontslice = true;
	obj.add(backmesh);
	obj.add(new THREE.Mesh( srf_tp.toThreeGeometry(), activeMat ));
	obj.add(new THREE.Mesh( srf_st.toThreeGeometry(), activeMat ));
	obj.add(new THREE.Mesh( srf_ft.toThreeGeometry(), activeMat ));

	// obj.add(new THREE.Mesh( srf_bs.toThreeGeometry(), matMesh_wirewhite ));
	// obj.add(new THREE.Mesh( srf_bk.toThreeGeometry(), matMesh_wirewhite ));
	// obj.add(new THREE.Mesh( srf_tp.toThreeGeometry(), matMesh_wirewhite ));
	// obj.add(new THREE.Mesh( srf_st.toThreeGeometry(), matMesh_wirewhite ));
	// obj.add(new THREE.Mesh( srf_ft.toThreeGeometry(), matMesh_wirewhite ));

	// getIsoCurves(srf_bs, 8).forEach(s => obj.add(new THREE.Line( s.toThreeGeometry(), matLine_white )));
	// getIsoCurves(srf_bk, 8).forEach(s => obj.add(new THREE.Line( s.toThreeGeometry(), matLine_white )));
	// getIsoCurves(srf_tp, 8).forEach(s => obj.add(new THREE.Line( s.toThreeGeometry(), matLine_white )));
	// getIsoCurves(srf_st, 8).forEach(s => obj.add(new THREE.Line( s.toThreeGeometry(), matLine_white )));
	// getIsoCurves(srf_ft, 8).forEach(s => obj.add(new THREE.Line( s.toThreeGeometry(), matLine_white )));








	var side_shp = new THREE.Shape();
    side_shp.moveTo(o_bs_pts[0][1], o_bs_pts[0][2]);
    side_shp.lineTo(o_bs_pts[2][1], o_bs_pts[2][2]);
	for(let i=0; i<1; i+=0.05) { let p = o_bk_crv.point(i); side_shp.lineTo(p[1], p[2]); }
	for(let i=0; i<1; i+=0.05) { let p = o_tp_crv.point(i); side_shp.lineTo(p[1], p[2]); }
	for(let i=0; i<1; i+=0.05) { let p = o_st_crv.point(i); side_shp.lineTo(p[1], p[2]); }
	for(let i=0; i<1; i+=0.05) { let p = o_ft_crv.point(i); side_shp.lineTo(p[1], p[2]); }
	var sideA = new THREE.Mesh( new THREE.ShapeGeometry( side_shp ), activeMat );
	sideA.rotation.set(Math.PI / 2, Math.PI / 2, 0);
	sideA.position.x = i_bs_pts[0][0] * w_mul * w_outerMul;
	obj.add(sideA);


	var sideB = new THREE.Mesh( new THREE.ShapeGeometry( side_shp ), activeMat );
	sideB.rotation.set(Math.PI / 2, Math.PI / 2, 0);
	sideB.position.x = -(i_bs_pts[0][0] * w_mul * w_outerMul);
	obj.add(sideB);

	sliceManager.addSliceSet({uDir: true, start: -400, end: 400, cuts: 7});
	sliceManager.addSliceSet({uDir: false, start: -50, end: 600, cuts: 6});

	group.add(obj);
}







function getIsoCurves(srf, divs) {
	var ret = [];
	var l = 1/divs;
	for (let i=0; i<1; i+=l) {
		ret.push(srf.isocurve(i, true));
	}
	for (let i=0; i<1; i+=l) {
		ret.push(srf.isocurve(i, false));
	}
	return ret;
}


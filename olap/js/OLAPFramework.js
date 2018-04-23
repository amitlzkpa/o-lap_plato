
function hasMethod(objToChk, methodName) {
	return objToChk && typeof objToChk[methodName] === "function";
}

function hasProperty(objToChk, propertyName) {
	return objToChk && typeof objToChk[propertyName] === "object";
}



class Slicer {
	constructor(config) {
		this.start = new THREE.Vector3(config.start[0], 0, config.start[1]);
		this.end = new THREE.Vector3(config.end[0], 0, config.end[1]);
		this.cuts = config.cuts;
	}

	getSlice(geom) {
		let retObj = new THREE.Object3D();
		let m = [];
		OLAP.getAllMeshes(geom, m);
		console.log(m);
		let d = this.end.distanceTo(this.start);
		let offset = d / this.cuts;
		let startD = -this.start.distanceTo(new THREE.Vector3());

		var normalVector = new THREE.Vector3();
		normalVector.subVectors( this.start, this.end );
        var materialLine = new THREE.LineBasicMaterial({ color: 0x000000 });

        // var planes = [];
        // planes.push(new THREE.Plane(normalVector, 150));
        // OLAP.scene.add(new THREE.PlaneHelper(planes[0], 300));
        // var intersects = new MODE.planeIntersect(m[0].geometry, planes);
        // var lines = intersects.wireframe(materialLine);
        // OLAP.scene.add(lines);
        // console.log(lines);


        for (let i = 0; i <= this.cuts; i++) {
        	console.log(`Cut No: ${i}`);
	        var planes = [];
            planes.push(new THREE.Plane(normalVector, (startD + (i * offset))));
            OLAP.scene.add(new THREE.PlaneHelper(planes[0], 300));
            var contSet = new THREE.Object3D();
	        for (let i = 0; i < m.length; i++) {
		        var intersects = new MODE.planeIntersect(m[i].geometry, planes);
		        var lines = intersects.wireframe(materialLine);
		        if(lines.children.length > 0) {
			        OLAP.scene.add(lines);
			        console.log(lines);
		        }
	        	// contSet.add(lines);
	        }
	        // retObj.add(contSet);
        }
		return retObj;
	}

}




class SliceManager {


	constructor() {
		this.slicers = [];
	}


	addSlicer(config) {
		this.slicers.push(new Slicer(config));
	}

	getAllSlices(geom) {
		let retObj = new THREE.Object3D();
		for(let i=0; i<this.slicers.length; i++) {
			retObj.add(this.slicers[i].getSlice(geom));
		}
		return retObj;
	}



}



class OLAPFramework {




	getAllMeshes(geom, addTo) {
		if (geom.type == "Mesh") addTo.push(geom);
		if(geom.children.length == 0) {
			return;
		}
		else {
			for (let i = 0; i < geom.children.length; i++) {
				this.getAllMeshes(geom.children[i], addTo);
			}
		}
	}

	
	async checkMessage() {
		var url = "https://gitcdn.xyz/repo/O-LAP/home/master/olap/js/info.json";
		var infoJSON = await $.getJSON(url);
		if(this.version != infoJSON.latest_version) {
			console.log(`${infoJSON.latest_version} is available. Consider upgrading the framework.`);
		}
		if(infoJSON.message != "") console.log(infoJSON.message);
	}

	constructor() {
		this.version = "1.0.0";
		this.scene = scene;
		this.inputs = {};
		this.$ui = $("#ui");
		this.$name = $("#design-name");
		this.$designer = $("#designer");
		this.$designmessage = $("#design-message");
		this.$version = $("#version");
		this.$license = $("#license");
		this.$short_desc = $("#short-desc");
		this.loadedDesign = null;
		this.inputVals = {};
		this.geometry = new THREE.Object3D();
		this.sliceManager = new SliceManager();

	    $('#rotate-switch').on('change', function(e) {
	      var isRot = $(this).is(':checked');
	      cameraControls.autoRotate = isRot;
	    });
	}

	openDesign(designObj) {

		this.checkMessage();

		if(!hasProperty(designObj, "info")) {
			console.log("Design file needs property 'info' containing design information.");
			console.log("Aborting design open.");
			return;
		}
		if(!hasProperty(designObj, "inputs")) {
			console.log("Design file needs property 'inputs' containing design inputs configuration.");
			console.log("Aborting design open.");
			return;
		}
		if(!hasProperty(designObj, "inputState")) {
			console.log("Design file needs property 'inputState' to pass down input values.");
			console.log("Aborting design open.");
			return;
		}
		if(!hasMethod(designObj, "init")) {
			console.log("Design file needs to implement 'init' method to initialize state.");
			console.log("Aborting design open.");
			return;
		}
		if(!hasMethod(designObj, "onParamChange")) {
			console.log("Design file needs to implement 'onParamChange' method to recieve updated parameter values.");
			console.log("Aborting design open.");
			return;
		}
		if(!hasMethod(designObj, "updateGeom")) {
			console.log("Design file needs to implement 'updateGeom' method to trigger design regeneration.");
			console.log("Aborting design open.");
			return;
		}

		this.clearUI();
		this.clearGeometry();
		this.loadedDesign = designObj;
		this.loadedDesign.init();
		this.loadUI();
		this.updateGeom();
	}

	clearUI() {
		this.$ui.empty();
	}

	clearGeometry() {
		if (this.geometry == null) return;
		scene.remove(this.geometry);
		this.geometry = null;
	}

	loadUI() {
		var params = this.loadedDesign.inputs.params;
		this.$name.text(this.loadedDesign.info.name);
		this.$designer.text(this.loadedDesign.info.designer);
		this.$designmessage.text(this.loadedDesign.info.message);
		this.$version.text(this.loadedDesign.info.version);
		this.$license.text(this.loadedDesign.info.license);
		this.$short_desc.text(this.loadedDesign.info.short_desc);
		for (let param of params) {
			this.inputVals[param] = this.loadedDesign.inputs[param].default;	// put the default value into curr state
			this.addUIItem(this.loadedDesign.inputs[param], param);				// add the ui item
			this.$ui.append('<div class="divider"></div>');
		}
	}

	getSlicer(type) {
		return new Slicer(type);
	}

	updateGeom() {
		this.scene.remove(this.geometry);
		this.geometry = new THREE.Object3D();
		var inpStateCopy = {};													// make a copy of input state to pass it to design object
		for(var key in this.inputVals) {
		    var value = this.inputVals[key];
		    inpStateCopy[key] = value;
		}
		this.loadedDesign.inputState = inpStateCopy;
		this.loadedDesign.onParamChange(inpStateCopy);
		this.sliceManager = new SliceManager();
		this.loadedDesign.updateGeom(this.geometry, this.sliceManager)
		this.scene.add(this.geometry);
		if (true) this.scene.add(this.sliceManager.getAllSlices(this.geometry));
	}

	addUIItem(inpConfig, id) {
		if (typeof inpConfig === 'undefined' || typeof inpConfig.type === 'undefined') {
			console.log("Foll registered input doesn't have config: " + id + cnt);
			return;
		}
		let tipTxt = "";
		switch(inpConfig.type) {
			case "select":
				tipTxt = (typeof inpConfig.tip !== 'undefined') ? `<span class="grey-text">${inpConfig.tip}</span></br>` : "";
				var html = `<div class="input-field" id="${id}"><select>\n`;
				for(let s of inpConfig.choices) { html += `<option value="${s}">${s}</option>\n`; }
				html += `</select><label>${inpConfig.label}</label></div>\n${tipTxt}\n`;
				var p = this.$ui.append(html);
				$('select').formSelect();										// materilize initialization
				var fw = this;													// cache ref to framework for passing it to the event listening registration
				p.find('#' + id).on('change',function(e){
					fw.inputVals[id] = $('#'+id + ' :selected').text();			// update curr state
					fw.updateGeom();											// trigger an update
				});
				break;
			case "slider":
				tipTxt = (typeof inpConfig.tip !== 'undefined') ? `<span class="grey-text">${inpConfig.tip}</span></br>` : "";
				var html = `
						    <div class="range-field">
							  <p>${inpConfig.label}</p>
							  <span class="left">${inpConfig.min}</span>
							  <span class="right">${inpConfig.max}</span>
						      <input type="range" min="${inpConfig.min}" max="${inpConfig.max}" id="${id}" />
							  ${tipTxt}
						    </div>
							`;
				var q = this.$ui.append(html);
				var fw = this;													// cache ref to framework for passing it to the event listening registration
				q.find('#' + id).on('input',function(e){
					fw.inputVals[id] = $(this).val();							// update curr state
					fw.updateGeom();											// trigger an update
				});
				break;
			case "bool":
				tipTxt = (typeof inpConfig.tip !== 'undefined') ? `<span class="grey-text">${inpConfig.tip}</span></br>` : "";
				var html = `
						    <p>
						      <label>
						        <input type='checkbox' id="${id}"/>
						        <span>${inpConfig.label}</span>
						      </label></br>
							  ${tipTxt}
						    </p>
						    `;
				var r = this.$ui.append(html);
				var fw = this;													// cache ref to framework for passing it to the event listening registration
				r.find("#" + id).on('change',function(e){
					fw.inputVals[id] = $(this).is(":checked");					// update curr state
					fw.updateGeom();											// trigger an update
				});
				break;
		}
	}

}


var OLAP = new OLAPFramework();


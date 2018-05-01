/**
 * A library of geometry focused tools for computational designers.
 * @author ekatzenstein
 * @namespace MODE
 */

var MODE = {
    VERSION: 'Alpha'
}; 


/**
 * Intersect geometry with a plane - based off of [Paul Bourke's contouring algorithms]{@link    http://paulbourke.net/papers/conrec/}
 * @author ekatzenstein        
 * @param   {THREE.Geometry} geometry Geometry to intersect with plane
 * @param   {THREE.Plane}    plane   Plane or array of planes to intersect with geometry
 * @constructor   
 * @memberof MODE  
 */
MODE.planeIntersect = function (geo, planes) {
    return this.get(geo, planes);
}

MODE.planeIntersect.prototype = {
    constructor: {},
    orient: function (loc) {
        var subVec = new THREE.Vector3(0, 0, 1);
        var normVec = subVec.normalize();
        var multVec = normVec.multiplyScalar(loc)
        return multVec.z;
    },
    rotationVector: new THREE.Vector3(),
    geometry: new THREE.Geometry(),
    get: function (geo, planes) {
        geo = geo.clone();
        if (planes.constructor != Array) {
            planes = [planes]
        }
        var allCrvs = [];
        this.rotationVector = new THREE.Vector3(planes[0].normal.y, planes[0].normal.x, planes[0].normal.z);
        this.rotationVector.normalize();
        var rv = this.rotationVector;
        geo.vertices.forEach(function (d, i) {
            d.applyAxisAngle(rv, Math.PI / 2)
        })

        planes.forEach(function (d, i) {
            var tp = new THREE.Plane(new THREE.Vector3(0, 0, 1), d.constant);
            intersectPlane(geo, tp);
        })

        var shapes = [];
        allCrvs.forEach(function (d, i) {
            var polyShape = new THREE.Shape();
            d.forEach(function (e, j) {
                if (j == 0) {
                    polyShape.moveTo(e.x, e.y, e.z);
                } else {
                    polyShape.lineTo(e.x, e.y, e.z);
                }
            })
            polyShape.planeLoc = d.planeLoc

            shapes.push(polyShape)
        })
        this.crvs = allCrvs;
        this.shapes = shapes;


        function intersectPlane(geo, plane) {
            allLines = [];
            allPolylines = [];

            simpPLs = [];

            var A = plane.normal.x;
            var B = plane.normal.y;
            var C = plane.normal.z;
            var D = plane.constant;

            for (var i = 0; i < geo.faces.length; i++) {
                var f = geo.faces[i]
                var pa = geo.vertices[f.a];
                var pb = geo.vertices[f.b];
                var pc = geo.vertices[f.c];
                if (contourFace(pa, pb, pc, A, B, C, D) != 0 && contourFace(pa, pb, pc, A, B, C, D) != -1) {
                    allLines.push(contourFace(pa, pb, pc, A, B, C, D))
                }
            }

            var lineLists = []
            for (var i = 0; i < allLines.length; i++) {
                lineLists.push([allLines[i].start, allLines[i].end])
            }

            joinLines(lineLists, D);

            for (var s = 0; s < allPolylines.length; s++) {
                allPolylines[s].planeLoc = allPolylines.planeLoc;
                allCrvs.push(allPolylines[s])
            }

            function contourFace(pa, pb, pc, planeA, planeB, planeC, D) {
                var sideA = planeA * pa.x + planeB * pa.y + planeC * pa.z + D;
                var sideB = planeA * pb.x + planeB * pb.y + planeC * pb.z + D;
                var sideC = planeA * pc.x + planeB * pc.y + planeC * pc.z + D;

                var sA = Math.sign(sideA);
                var sB = Math.sign(sideB);
                var sC = Math.sign(sideC);

                var p1 = new THREE.Vector3();
                var p2 = new THREE.Vector3();


                if (sideA >= 0 && sideB >= 0 && sideC >= 0) {
                    return 0;
                } else if (sideA <= 0 && sideB <= 0 && sideC <= 0) {
                    return 0;
                } else if (sA != sB && sA != sC) {
                    p1.x = pa.x - sideA * (pc.x - pa.x) / (sideC - sideA);
                    p1.y = pa.y - sideA * (pc.y - pa.y) / (sideC - sideA);
                    p1.z = pa.z - sideA * (pc.z - pa.z) / (sideC - sideA);
                    p2.x = pa.x - sideA * (pb.x - pa.x) / (sideB - sideA);
                    p2.y = pa.y - sideA * (pb.y - pa.y) / (sideB - sideA);
                    p2.z = pa.z - sideA * (pb.z - pa.z) / (sideB - sideA);
                    var line = new THREE.Line3(p1, p2)
                    return line;
                } else if (sB != sA && sB != sC) {
                    p1.x = pb.x - sideB * (pc.x - pb.x) / (sideC - sideB);
                    p1.y = pb.y - sideB * (pc.y - pb.y) / (sideC - sideB);
                    p1.z = pb.z - sideB * (pc.z - pb.z) / (sideC - sideB);
                    p2.x = pb.x - sideB * (pa.x - pb.x) / (sideA - sideB);
                    p2.y = pb.y - sideB * (pa.y - pb.y) / (sideA - sideB);
                    p2.z = pb.z - sideB * (pa.z - pb.z) / (sideA - sideB);
                    var line = new THREE.Line3(p1, p2)
                    return line;
                } else if (sC != sB && sC != sA) {
                    p1.x = pc.x - sideC * (pa.x - pc.x) / (sideA - sideC);
                    p1.y = pc.y - sideC * (pa.y - pc.y) / (sideA - sideC);
                    p1.z = pc.z - sideC * (pa.z - pc.z) / (sideA - sideC);
                    p2.x = pc.x - sideC * (pb.x - pc.x) / (sideB - sideC);
                    p2.y = pc.y - sideC * (pb.y - pc.y) / (sideB - sideC);
                    p2.z = pc.z - sideC * (pb.z - pc.z) / (sideB - sideC);
                    var line = new THREE.Line3(p1, p2)
                    return line;
                } else {
                    return -1;
                }

            }
        }

        function joinLines(lines, constant) {
            var hit = 0;
            lineJoin(0)
            lines.planeLoc = -constant;
            allPolylines = lines;

            function lineJoin(i) {
                var tol = .0000001;
                hit = 0;
                var l = lines[i];
                for (var j = 0; j < lines.length; j++) {
                    if (i == Math.min(j, lines.length)) {
                        continue;
                    }
                    var l2 = lines[Math.min(j, lines.length)];
                    if (l[0].distanceTo(l2[0]) < tol) {
                        l.unshift(l2[1]);
                        lines.splice(Math.min(j, lines.length), 1);
                        j--
                        hit++;
                    } else if (l[0].distanceTo(l2[1]) < tol) {
                        l.unshift(l2[0]);
                        lines.splice(Math.min(j, lines.length), 1);
                        j--
                        hit++;
                    } else if (l[l.length - 1].distanceTo(l2[1]) < tol) {
                        l.push(l2[0]);
                        lines.splice(Math.min(j, lines.length), 1);
                        j--
                        hit++;
                    } else if (l[l.length - 1].distanceTo(l2[0]) < tol) {
                        l.push(l2[1]);
                        lines.splice(Math.min(j, lines.length), 1);
                        j--
                        hit++;
                    }
                    if (j == lines.length - 1) {
                        if (hit == 0) {
                            lineJoin(i + 1);
                        } else {
                            lineJoin(i);
                        }

                    }
                }
            }
        }
    },

    /**
     * Create a THREE.Object3D by generatingedge geometry from intersection shapes
     * @author ekatzenstein
     * @param {material} material line material to assign to wireframe object
     * @returns {THREE.Object3D} Wireframe object                        
     */
    wireframe: function (material) {
        wires = new THREE.Object3D();

        var ob = this;
        this.crvs.forEach(function (d, i) {
            var geo = new THREE.Geometry();
            geo.vertices = d;
            var line = new THREE.Line(geo, material)
            wires.add(line)
        })
        var rv = this.rotationVector;
        wires.rotateOnAxis(rv, -Math.PI / 2)
        wires.updateMatrixWorld(true);
        this.wires = wires;
        return wires;
    },
}
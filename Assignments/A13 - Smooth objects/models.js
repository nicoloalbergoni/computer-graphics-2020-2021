function crossV3(a, b) {
	return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
}

function normalizeV3(v) {
	let norm = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
	return [v[0] / norm, v[1] / norm, v[2] / norm];
}

function buildGeometry() {
	// Draws a pyramid --- Already done, just for inspiration
	var vert1 = [[0.0,1.0,0.0, 0.0, 0.4472,-0.8944],[ 1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944],[-1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944],
				 [0.0,1.0,0.0, 0.8944, 0.4472,0.0],[ 1.0,-1.0, 1.0, 0.8944, 0.4472,0.0],[ 1.0,-1.0,-1.0, 0.8944, 0.4472,0.0], 
				 [0.0,1.0,0.0, 0.0, 0.4472,0.8944],[-1.0,-1.0, 1.0, 0.0, 0.4472,0.8944],[ 1.0,-1.0, 1.0, 0.0, 0.4472,0.8944], 
				 [0.0,1.0,0.0, -0.8944, 0.4472,0.0],[-1.0,-1.0,-1.0, -0.8944, 0.4472,0.0],[-1.0,-1.0, 1.0, -0.8944, 0.4472,0.0], 
				 [-1.0,-1.0,-1.0, 0.0,-1.0,0.0],[1.0,-1.0,-1.0, 0.0,-1.0,0.0], [1.0,-1.0,1.0, 0.0,-1.0,0.0], [-1.0,-1.0,1.0, 0.0,-1.0,0.0],
				];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	addMesh(vert1, ind1, color1);
	
	// Draws a cube -- To do for the assignment.
	var vert2 = [
		// Front Face
		[-1.0, -1.0, 1.0, 0.0, 0.0, 1.0], [1.0, -1.0, 1.0, 0.0, 0.0, 1.0], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0], [-1.0, 1.0, 1.0, 0.0, 0.0, 1.0],
		// Left Face
		[-1.0, -1.0, -1.0, -1.0, 0.0, 0.0], [-1.0, -1.0, 1.0, -1.0, 0.0, 0.0], [-1.0, 1.0, 1.0, -1.0, 0.0, 0.0], [-1.0, 1.0, -1.0, -1.0, 0.0, 0.0],
		// Back Face
		[-1.0, -1.0, -1.0, 0.0, 0.0, -1.0], [1.0, -1.0, -1.0, 0.0, 0.0, -1.0], [1.0, 1.0, -1.0, 0.0, 0.0, -1.0], [-1.0, 1.0, -1.0, 0.0, 0.0, -1.0],
		// Right Face
		[1.0, -1.0, -1.0, 1.0, 0.0, 0.0], [1.0, -1.0, 1.0, 1.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0, 0.0, 0.0], [1.0, 1.0, -1.0, 1.0, 0.0, 0.0],
		// Bottom Face
		[-1.0, -1.0, 1.0, 0.0, -1.0, 0.0], [1.0, -1.0, 1.0, 0.0, -1.0, 0.0], [1.0, -1.0, -1.0, 0.0, -1.0, 0.0], [-1.0, -1.0, -1.0, 0.0, -1.0, 0.0],
		// Upper Face
		[-1.0, 1.0, 1.0, 0.0, 1.0, 0.0], [1.0, 1.0, 1.0, 0.0, 1.0, 0.0], [1.0, 1.0, -1.0, 0.0, 1.0, 0.0], [-1.0, 1.0, -1.0, 0.0, 1.0, 0.0] 
	];

	var ind2 = [0, 1, 2, 0, 2, 3,
							4, 5, 6, 4, 6, 7,
							9, 8, 11, 9, 11, 10, // Different order for back-face culling (Back Face)
							13, 12, 15, 13, 15, 14, // Different order for back-face culling (Right Face)
							17, 16, 19, 17, 19, 18, // Different order for back-face culling (Bottom Face)
						  20, 21, 22, 20, 22, 23
						];
	var color2 = [0.0, 1.0, 1.0];
	addMesh(vert2, ind2, color2);
	
	// Draws function y = sin(x) * cos(z) with -3 <= x <= 3 and -3 <= z <= 3 -- To do for the assignment.

	var vert3 = [];
	for(let i = 0; i < 7; i++) {
		for(let j = 0; j < 7; j++) {
			let x = i - 3;
			let z = j - 3;			
			let y = Math.sin(x) * Math.cos(z);
			let dx = [1, Math.cos(x) * Math.cos(z), 0];
			let dz = [0, Math.sin(x) * (-Math.sin(z)), 1];
			let cross_dx_dz = crossV3(dx, dz);
			let normal = normalizeV3(cross_dx_dz); 
				
			vert3[(7*i) + j] = [x, y, z, -normal[0], -normal[1], -normal[2]];
		}
	}
	////// Creates indices
	var ind3 = [];
	
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 6; j++) {
			ind3.push((7 * i) + j);
			ind3.push((7 * i) + j + 1);
			ind3.push((7 * i) + j + 7);

			ind3.push((7 * i) + j + 1);
			ind3.push((7 * i) + j + 8);
			ind3.push((7 * i) + j + 7);
		}		
	}

	var color3 = [0.0, 1.0, 1.0];
	addMesh(vert3, ind3, color3);
	
	// Draws a Cylinder --- To do for the assignment
	var vert4 = [[-1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,1.0,0.0, 0.0, 0.0,1.0], [-1.0,1.0,0.0, 0.0, 0.0,1.0]];
	var ind4 = [0, 1, 2,  0, 2, 3];
	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, ind4, color4);

	// Draws a Sphere --- To do for the assignment.
	var vert5 = [[-1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,-1.0,0.0, 0.0, 0.0,1.0], [1.0,1.0,0.0, 0.0, 0.0,1.0], [-1.0,1.0,0.0, 0.0, 0.0,1.0]];
	var ind5 = [0, 1, 2,  0, 2, 3];
	var color5 = [1.0, 0.0, 0.0];
	addMesh(vert5, ind5, color5);
}


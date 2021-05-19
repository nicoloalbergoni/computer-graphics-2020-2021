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
		var vert4 = [];
		var ind4 = [];

		let height = 5;
		let radius = 2;

		for (let i = 0; i < 4; i++) {
			let h = - (i * height) + (height / 2.0); 	// y is set from -heigth/2 to height/2
			for (let j = 0; j < 36; j++) {
				let theta = j * 10;
				let x = radius * Math.sin(utils.degToRad(theta));
				let z = radius * Math.cos(utils.degToRad(theta));
				
				if (i < 2) { // Create vertices for flat surface
					let y = h;				
					let normal = normalizeV3([Math.sin(utils.degToRad(theta)), 0, Math.cos(utils.degToRad(theta))]);
					vert4.push([x,y,z, ...normal]);
				} else if (i == 2) { // Create vertices for upper disk
					let y = height / 2.0;				
					let normal = [0, 1, 0];
					vert4.push([x,y,z, ...normal]);
				} else { // Create vertices for bottom disk
					let y = - (height / 2.0);				
					let normal = [0, -1, 0];
					vert4.push([x,y,z, ...normal]);
				}
			}			
		}

		// Create vertex for the center of the upper disk
		let up_center = [0, (height / 2.0), 0, 0, 1, 0];
		let up_center_pos = vert4.push(up_center) - 1;

		// Create vertex for the center of the bottom disk
		let bottom_center = [0, -(height / 2.0), 0, 0, -1, 0];
		let bottom_center_pos = vert4.push(bottom_center) - 1;

		// Assign indexes for the surface of the cylinder
		for (let j = 0; j < 36; j++) {
			ind4.push(j);
			ind4.push(j + 36);
			ind4.push(((j + 1) % 36) + 36);

			ind4.push(((j + 1) % 36) + 36);
			ind4.push((j + 1) % 36);
			ind4.push(j);
		}			

		// Assign indexes for the upper disk
		for (let i = 0; i < 36; i++) {
			ind4.push(up_center_pos);
			ind4.push((36 * 2) + i);
			ind4.push((36 * 2) + ((i + 1) % 36));			
		}
		
		// Assign indexes for the bottom disk (different order for back-face culling)
		for (let i = 0; i < 36; i++) {
			ind4.push(bottom_center_pos);
			ind4.push((36 * 3) + ((i + 1) % 36));					
			ind4.push((36 * 3) + i);
		}
	
	var color4 = [1.0, 1.0, 0.0];
	addMesh(vert4, ind4, color4);

	// Draws a Sphere --- To do for the assignment.
	var vert5 = [];
	var ind5 = [];

	let Sradius = 2;	

	for(let i = 0; i < 19; i++) {
		for(let j = 0; j < 36; j++) {
			theta = i * 10;
			phi = j * 10;
			let x = Sradius * Math.sin(utils.degToRad(theta)) * Math.sin(utils.degToRad(phi));
			let y = Sradius * Math.cos(utils.degToRad(theta));
			let z = Sradius * Math.sin(utils.degToRad(theta)) * Math.cos(utils.degToRad(phi));


			let dtheta = [Sradius * Math.cos(utils.degToRad(theta)) * Math.sin(utils.degToRad(phi)), Sradius * -Math.sin(utils.degToRad(theta)), Sradius * Math.cos(utils.degToRad(theta)) * Math.cos(utils.degToRad(phi))];
			let dphi = [Sradius * Math.sin(utils.degToRad(theta)) * Math.cos(utils.degToRad(phi)), 0, Sradius * Math.sin(utils.degToRad(theta)) * -Math.sin(utils.degToRad(phi))];
			let nCross = normalizeV3(crossV3(dphi, dtheta));
			let normal = [-nCross[0], -nCross[1], -nCross[2]];

			// Set normal for north pole
			if (theta == 0) {
				normal = [0, 1, 0];
			}

			vert5.push([x,y,z, ...normal]);	
		}
	}
	
	// y_center = radius * Math.cos(utils.degToRad(80));
	// vert3.push([0,y_center,0]);
	// console.log(vert3);

	////// Creates indices
	var ind5 = [];	


		for(let i = 0; i < 18; i++) {
			for(let j = 0; j < 36; j++) {
				ind5.push((36 * i) + j);
				ind5.push((36 * i) + j + 36);
				ind5.push(((36 * i) + ((j + 1) % 36) + 36 ));

				ind5.push(((36 * i) + ((j + 1) % 36) + 36));
				ind5.push((36 * i) + ((j + 1) % 36));
				ind5.push((36 * i) + j);

			}		
				
			// Manual Indexes

			// ind3.push((36 * i) + 35);
			// ind3.push((36 * i) + 35 + 36);
			// ind3.push(((36 * i) + 0 + 36 ));

			// ind3.push(((36 * i) + 0 + 36));
			// ind3.push((36 * i) + 0);
			// ind3.push((36 * i) + 35);
	}

	var color5 = [1.0, 0.0, 0.0];
	addMesh(vert5, ind5, color5);
}


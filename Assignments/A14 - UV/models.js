function crossV3(a, b) {
	return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
}

function normalizeV3(v) {
	let norm = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2));
	return [v[0] / norm, v[1] / norm, v[2] / norm];
}

function buildGeometry() {
	var i,j;
	// Draws a pyramid --- To complete for the assignment. This is just the one in Assignment 13, where two 0.1, 0.1 UV components have been added to the vertices definitions. Such number must be replaced (differently for each vertexes), to obtain a proper Egyptian Pyramid

									// Back Face
		var vert1 = [[0.0,1.0,0.0, 0.0, 0.4472,-0.8944, 0.625, 0.5],[ 1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944, 0.5, 0.25],[-1.0,-1.0,-1.0, 0.0, 0.4472,-0.8944, 0.75, 0.25],
								  // Right Face
				 				[0.0,1.0,0.0, 0.8944, 0.4472,0.0, 0.625, 0.5],[ 1.0,-1.0, 1.0, 0.8944, 0.4472,0.0, 0.75, 0.25],[ 1.0,-1.0,-1.0, 0.8944, 0.4472,0.0, 0.5, 0.25], 
								  // Front Face
								[0.0,1.0,0.0, 0.0, 0.4472,0.8944, 0.625, 0.25],[-1.0,-1.0, 1.0, 0.0, 0.4472,0.8944, 0.5, 0.0],[ 1.0,-1.0, 1.0, 0.0, 0.4472,0.8944, 0.75, 0.0], 
								  // Left Face
								[0.0,1.0,0.0, -0.8944, 0.4472,0.0, 0.875, 0.5],[-1.0,-1.0,-1.0, -0.8944, 0.4472,0.0, 0.75, 0.25],[-1.0,-1.0, 1.0, -0.8944, 0.4472,0.0, 1, 0.25], 
									// Bottom Face
								[-1.0,-1.0,-1.0, 0.0,-1.0,0.0, 0.75, 0.0],[1.0,-1.0,-1.0, 0.0,-1.0,0.0, 1,0.0], [1.0,-1.0,1.0, 0.0,-1.0,0.0, 1,0.25], [-1.0,-1.0,1.0, 0.0,-1.0,0.0, 0.75,0.25]
				];
	var ind1 = [0, 1, 2,  3, 4, 5,  6, 7, 8,  9, 10, 11,  12, 13, 14,  12, 14, 15];
	var color1 = [0.0, 0.0, 1.0];
	
	addMesh(vert1, ind1, color1);
	
	// Draws a cube -- To do for the assignment.

	var vert2 = [
		// Front Face
		[-1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.125, 0.625], [1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.25, 0.625], [1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.25, 0.75], [-1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.125, 0.75],
		// Left Face
		[-1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0, 0.625], [-1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 0.125, 0.625], [-1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 0.125, 0.75], [-1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0, 0.75],
		// Back Face
		[-1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.125, 1], [1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.25, 1], [1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.25, 0.875], [-1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.125, 0.875],
		// Right Face
		[1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.375, 0.625], [1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.25, 0.625], [1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.25, 0.75], [1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 0.375, 0.75],
		// Bottom Face
		[-1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.125, 0.625], [1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.25, 0.625], [1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.25, 0.5], [-1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.125, 0.5],
		// Upper Face
		[-1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.125, 0.75], [1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.25, 0.75], [1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.25, 0.875], [-1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.125, 0.875] 
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
	
	
	// Draws a Cylinder --- To do for the assignment
	var vert3 = [];
	var ind3 = [];

	let height = 5;
	let radius = 2;

	for (let i = 0; i < 4; i++) {
		let h = - (i * height) + (height / 2.0); 	// y is set from heigth/2 to -height/2
		for (let j = 0; j < 36; j++) {
			let theta = j * 10;
			let x = radius * Math.sin(utils.degToRad(theta));
			let z = radius * Math.cos(utils.degToRad(theta));
			
			if (i < 2) { // Create vertices for flat surface
				let y = h;	
				let step = (j * (0.5/36.0)) + (0.5/36.0); // Step for the U coordinate, it starts from 0.5 + 0.5/36 (as there is a small white line in 0.5) and goes up to 1
				let uv = [0.5 + step, y > 0 ? 0.75 : 0.5]; // The V coordinate is 0.75 for the upper part of the cylinder and 0.5 for the bottom part
								
				// It is enough to normalize the cartesian expression of the coordinates
				// let normal = normalizeV3([Math.sin(utils.degToRad(theta)), 0, Math.cos(utils.degToRad(theta))]);

				let dtheta = [radius * Math.cos(utils.degToRad(theta)), 0, radius * -Math.sin(utils.degToRad(theta))];
				let dh = [0, 1, 0];
				let nCross = normalizeV3(crossV3(dh, dtheta));
				let normal = [-nCross[0], -nCross[1], -nCross[2]];						
				
				vert3.push([x,y,z, ...normal, ...uv]);

				// Normally the last vertex should connect with the first one to create a triangle that close the circle. In our case we have to connect to the a vertex that have the same position
				// as the first one (theta = 0) but different UV coordinates, hence we need to create an additional vertex				 
				if (j == 35) {
					theta = 0;
					x = radius * Math.sin(utils.degToRad(theta));
					z = radius * Math.cos(utils.degToRad(theta));
					y = h;						
					let uv = [1, y > 0 ? 0.75 : 0.5];								

					dtheta = [radius * Math.cos(utils.degToRad(theta)), 0, radius * -Math.sin(utils.degToRad(theta))];
					dh = [0, 1, 0];
					nCross = normalizeV3(crossV3(dh, dtheta));
					normal = [-nCross[0], -nCross[1], -nCross[2]];
					
					vert3.push([x,y,z, ...normal, ...uv]);
				}				

			} else if (i == 2) { // Create vertices for upper disk

				let y = height / 2.0;				
				let normal = [0, 1, 0];
				let u = 0.625 + (0.125 * Math.cos(utils.degToRad(theta)));
				let v = 0.875 + (0.125 * Math.sin(utils.degToRad(theta)));				
				vert3.push([x,y,z, ...normal, u, v]);

			} else { // Create vertices for bottom disk

				let y = - (height / 2.0);				
				let normal = [0, -1, 0];
				let u = 0.875 + (0.125 * Math.cos(utils.degToRad(theta)));
				let v = 0.875 + (0.125 * Math.sin(utils.degToRad(theta)));		
				vert3.push([x,y,z, ...normal, u, v]);

			}
		}			
	}

	// Create vertex for the center of the upper disk
	let up_center = [0, (height / 2.0), 0, 0, 1, 0, 0.625, 0.875];
	let up_center_pos = vert3.push(up_center) - 1;

	// Create vertex for the center of the bottom disk
	let bottom_center = [0, -(height / 2.0), 0, 0, -1, 0, 0.875, 0.875];
	let bottom_center_pos = vert3.push(bottom_center) - 1;

	// Assign indexes for the surface of the cylinder
	// Here we iterate 2 more times as we have to index the two additional vertex added before
	for (let j = 0; j < 37; j++) {
		ind3.push(j);
		ind3.push(j + 36);
		ind3.push((j + 1) + 36);

		ind3.push((j + 1) + 36);
		ind3.push((j + 1));
		ind3.push(j);
	}			

	// This variable accounts for the shift in the vertices of the up and bottom disk due to the 2 additional vertices added before
	let shift = 2;

	// Assign indexes for the upper disk
	for (let i = 0; i < 36; i++) {
		ind3.push(up_center_pos);
		ind3.push((36 * 2) + i + shift);
		ind3.push((36 * 2) + ((i + 1) % 36) + shift);			
	}
	
	// Assign indexes for the bottom disk (different order for back-face culling)
	for (let i = 0; i < 36; i++) {
		ind3.push(bottom_center_pos);
		ind3.push((36 * 3) + ((i + 1) % 36) + shift);					
		ind3.push((36 * 3) + i + shift);
	}

	var color3 = [0.0, 1.0, 1.0];
	addMesh(vert3, ind3, color3);
}
function buildGeometry() {
	var i;
	
	// Draws the outline of letter F (replace the vertices and primitive type)
	var vert1 = [[0.0,-6.0,0.0], [0.0,6.0,0.0], [6.0,6.0,0.0], [6.0,4.0,0.0], [2.0,4.0,0.0], [2.0,2.0,0.0],
								[5.0,2.0,0.0], [5.0,0.0,0.0], [2.0,0.0,0.0], [2.0,-6.0,0.0] ];

	addMesh(vert1, "O", [1.0, 0.0, 0.0]);


	// Draws a filled S-shaped pattern (replace the vertices and primitive type)
	var vert2 = [[-4,-7,0], [-4,-5,0], [1,-7,0], [-1,-5,0], [1,1,0], [-1,-1,0],
							[-2, 1,0], [-4,-1,0], [-2,5,0], [-4,7,0], [1,5,0], [1,7,0]];							

	addMesh(vert2, "S", [0.0, 0.0, 1.0]);


	// Draws a filled pentacong (replace the vertices and primitive type)
	let r = 2; // Radius of the inscribed circumference
	let tr = 2; // Length from vertex to center for translation


	//Projection of translation vector
	let tr_x = tr * Math.cos(utils.degToRad(54));
	let tr_y = tr * Math.sin(utils.degToRad(54));

	let va = [tr_x + (r * Math.cos(utils.degToRad(18))), tr_y + (r * Math.sin(utils.degToRad(18))), 0];
	let vb = [0 + tr_x, tr_y + r, 0];
	let vc = [tr_x + (r * Math.cos(utils.degToRad(-54))), 0, 0];
  let ve = [tr_x + (-r * Math.cos(utils.degToRad(18))) , tr_y + (r * Math.sin(utils.degToRad(18))) , 0];

	let vert3 = [[0,0,0], ve, vb, va, vc];

	// More "naive" solution
	//var vert3 = [[0,0,0], [-1.5,4.5,0], [2,7,0], [5.5,4.5,0], [4,0,0]];

	addMesh(vert3, "F", [0.0, 1.0, 0.0]);
	
}


function buildGeometry() {
	var i;
	
	// Draws function y = sin(x) * cos(z) with -3 <= x <= 3 and -3 <= z <= 3.
	///// Creates vertices
	var vert2 = [];
	for(i = 0; i < 7; i++) {
		for(j = 0; j < 7; j++) {
			x = i - 3;
			z = j - 3;			
			y = Math.sin(x) * Math.cos(z);
			vert2[(7*i) + j] = [x, y, z];
		}
	}
	////// Creates indices
	var ind2 = [];
	
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 6; j++) {
			ind2.push((7 * i) + j);
			ind2.push((7 * i) + j + 1);
			ind2.push((7 * i) + j + 7);

			ind2.push((7 * i) + j + 1);
			ind2.push((7 * i) + j + 8);
			ind2.push((7 * i) + j + 7);
		}		
	}

	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);


	// Draws a Half Sphere

	// Creates vertices
	var vert3 = [];
	var radius = 2;	

	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 36; j++) {
			theta = i * 10;
			phi = j * 10;
			x = radius * Math.sin(utils.degToRad(theta)) * Math.sin(utils.degToRad(phi));
			y = radius * Math.cos(utils.degToRad(theta));
			z = radius * Math.sin(utils.degToRad(theta)) * Math.cos(utils.degToRad(phi));
			vert3.push([x,y,z]);	
		}
	}
	
	let y_center = radius * Math.cos(utils.degToRad(80));
	let centerIndex = vert3.push([0,y_center,0]) - 1;

	// Creates indices
	var ind3 = [];	
		for(let i = 0; i < 8; i++) {
			for(let j = 0; j < 36; j++) {
				ind3.push((36 * i) + j);
				ind3.push((36 * i) + j + 36);
				ind3.push(((36 * i) + ((j + 1) % 36) + 36 ));

				ind3.push(((36 * i) + ((j + 1) % 36) + 36));
				ind3.push((36 * i) + ((j + 1) % 36));
				ind3.push((36 * i) + j);

			}		
	}

	// Bottom disk

	for (let j = 0; j < 36; j++) {
		ind3.push(centerIndex);
		ind3.push(((36 * 7) + ((j + 1) % 36) + 36 ));
		ind3.push((36 * 7) + j + 36);		
	}

	var color3 = [0.0, 1.0, 0.0];
	addMesh(vert3, ind3, color3);
}


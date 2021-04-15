function buildGeometry() {
	var i;
	

	// Draws function y = sin(x) * cos(z) with -3 <= x <= 3 and -3 <= z <= 3.
	///// Creates vertices
	var vert2 = [];
	for(i = 0; i <= 2; i++) {
		for(j = 0; j <= 2; j++) {
			x = i - 1;
			z = j - 1;
			vert2[i*3+j] = [x, 0, z];
		}
	}
	////// Creates indices
	var ind2 = [];
	for(i = 0; i < 2; i++) {
		for(j = 0; j < 2; j++) {
			ind2[6*(i*2+j)  ] = 3*j+i;
			ind2[6*(i*2+j)+1] = 3*j+i+1;
			ind2[6*(i*2+j)+2] = 3*(j+1)+i+1;
			ind2[6*(i*2+j)+3] = 3*j+i;
			ind2[6*(i*2+j)+4] = 3*(j+1)+i+1;
			ind2[6*(i*2+j)+5] = 3*(j+1)+i;
		}
	}


	var color2 = [0.0, 0.0, 1.0];
	addMesh(vert2, ind2, color2);






	// Draws a Half Sphere
	///// Creates vertices
	var vert3 = [];
	for(i = 0; i <= 2; i++) {
		for(j = 0; j <= 2; j++) {
			x = i - 1;
			z = j - 1;
			vert3[i*3+j] = [x, Math.cos(3.14*(x-z)), z];
		}
	}
		
	////// Creates indices
	var ind3 = [];
	for(i = 0; i < 2; i++) {
		for(j = 0; j < 2; j++) {
			ind3[6*(i*2+j)  ] = 3*j+i;
			ind3[6*(i*2+j)+1] = 3*j+i+1;
			ind3[6*(i*2+j)+2] = 3*(j+1)+i+1;
			ind3[6*(i*2+j)+3] = 3*j+i;
			ind3[6*(i*2+j)+4] = 3*(j+1)+i+1;
			ind3[6*(i*2+j)+5] = 3*(j+1)+i;
		}
	}
	
	var color3 = [0.0, 1.0, 0.0];
	addMesh(vert3, ind3, color3);
}


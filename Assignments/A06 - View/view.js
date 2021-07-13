function view() {
	// Make a Look-In-Direction matrix centered at (5,2.5,0), looking west and aiming 30 degrees down.
	var elevation1 = utils.MakeRotateXMatrix(-30);
	var direction1 = utils.MakeRotateYMatrix(90);
	var center_camera1 = utils.MakeTranslateMatrix(5, 2.5, 0);

	var B1 = utils.multiplyMatrices(center_camera1, direction1);
	var B2 = utils.multiplyMatrices(B1, elevation1);
	var view1 = utils.invertMatrix(B2);

	var A1 =  view1;
	// Make a Look-In-Direction matrix centered at (0,-1,-5), angled 170 degrees, with an elevation of 15 degrees, and a roll of 45 degrees.

	var roll2 = utils.MakeRotateZMatrix(45);
	var elevation2 = utils.MakeRotateXMatrix(15);
	var direction2 = utils.MakeRotateYMatrix(170);
	var center_camera2 = utils.MakeTranslateMatrix(0, -1, -5);

	var C1 = utils.multiplyMatrices(center_camera2, direction2);
	var C2 = utils.multiplyMatrices(C1, elevation2);
	var C3 = utils.multiplyMatrices(C2, roll2);
	var view2 = utils.invertMatrix(C3);

	var A2 =  view2;
			   
	// Make a Look-At-Matrix, centered at (-4, 2, -4), aiming at (0,0.5,0.5) and with up-vector (0,1,0).
	var c3 = [-4, 2, -4];
	var a3 = [0, 0.5, 0.5];
	var u3 = [0, 1, 0];
	 		
	var vz3 = [(c3[0] - a3[0]), (c3[1] - a3[1]), (c3[2] - a3[2])];
	var vz3_norm = utils.normalizeVector3(vz3);
	var vx3 = utils.crossVector(u3, vz3_norm);
	var vx3_norm = utils.normalizeVector3(vx3);
	var vy3_norm = utils.crossVector(vz3_norm, vx3_norm); // cross product of normalized vector is already normalized

	var camera_matrix3 = [
		vx3_norm[0], vy3_norm[0], vz3_norm[0], c3[0],
		vx3_norm[1], vy3_norm[1], vz3_norm[1], c3[1],
		vx3_norm[2], vy3_norm[2], vz3_norm[2], c3[2],
		0, 0, 0, 1
	];

	var view_matrix3 = utils.invertMatrix(camera_matrix3);

	var A3 =  view_matrix3;
			   
	// Make a Look-At-Matrix, centered at (2.57, 0, 0), aiming at (2.8,0,-1) and with up-vector (1,0,0).
	var c4 = [2.57, 0, 0];
	var a4 = [2.8, 0, -1];
	var u4 = [1, 0, 0];
			
	var vz4 = [(c4[0] - a4[0]), (c4[1] - a4[1]), (c4[2] - a4[2])];
	var vz4_norm = utils.normalizeVector3(vz4);
	var vx4 = utils.crossVector(u4, vz4_norm);
	var vx4_norm = utils.normalizeVector3(vx4);
	var vy4_norm = utils.crossVector(vz4_norm, vx4_norm); // cross product of normalized vector is already normalized

	var camera_matrix4 = [
		vx4_norm[0], vy4_norm[0], vz4_norm[0], c4[0],
		vx4_norm[1], vy4_norm[1], vz4_norm[1], c4[1],
		vx4_norm[2], vy4_norm[2], vz4_norm[2], c4[2],
		0, 0, 0, 1
	];

	var view_matrix4 = utils.invertMatrix(camera_matrix4);

	var A4 =  view_matrix4;

	return [A1, A2, A3, A4];
}
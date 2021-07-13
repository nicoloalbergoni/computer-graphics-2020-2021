function axonometry() {
	var w = 50;
	var a = 16 / 9;
	var n = 1;
	var f = 101;

	// Compute the projection matrix
	var proj = [
		1/w, 0, 0, 0,
		0, a / w, 0, 0,
		0, 0, -2/(f - n), -(f + n) / (f - n),
		0, 0, 0, 1
	];


	// Make an isometric view, w = 50, a = 16/9, n = 1, f = 101.
	var rot_y = utils.MakeRotateYMatrix(45); // Rotate around the Y axis 
	var rot_x = utils.MakeRotateXMatrix(35.26); //Rotate around the X axis

	var C1 = utils.multiplyMatrices(proj, rot_x);
	var C2 = utils.multiplyMatrices(C1, rot_y);
	 
	var A1 =  C2;
			   
	// Make a dimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated 20 around the x-axis
	var rot_y = utils.MakeRotateYMatrix(45); // Rotate around the Y axis 
	var rot_x = utils.MakeRotateXMatrix(20); //Rotate around the X axis

	var D1 = utils.multiplyMatrices(proj, rot_x);
	var D2 = utils.multiplyMatrices(D1, rot_y);

	var A2 =  D2;
			   
	// Make a trimetric view, w = 50, a = 16/9, n = 1, f = 101, rotated -30 around the x-axis and 30 around the y-axis

	var rot_y = utils.MakeRotateYMatrix(30); // Rotate around the Y axis 
	var rot_x = utils.MakeRotateXMatrix(-30); //Rotate around the X axis
 
	var E1 = utils.multiplyMatrices(proj, rot_x);
	var E2 = utils.multiplyMatrices(E1, rot_y);

	var A3 =  E2;
			   
	// Make an cavalier projection view, w = 50, a = 16/9, n = 1, f = 101, at 45 degrees
	var rho = 1; // 1 for cavalier projections
	var alpha = Math.PI/4; // 45 degrees
	var shear = [
		1, 0, -rho * Math.cos(alpha), 0,
		0, 1, -rho * Math.sin(alpha), 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	var F1 = utils.multiplyMatrices(proj, shear);

	var O1 =  F1;

	// Make a cabinet projection view, w = 50, a = 16/9, n = 1, f = 101, at 60 degrees
	var rho = 0.5; // 0.5 for cabinet projections
	var alpha = Math.PI/3; // 60 degrees
	var shear = [
		1, 0, -rho * Math.cos(alpha), 0,
		0, 1, -rho * Math.sin(alpha), 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	var G1 = utils.multiplyMatrices(proj, shear);

	var O2 = G1;

	return [A1, A2, A3, O1, O2];
}
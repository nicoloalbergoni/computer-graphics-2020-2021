function move() {
	// Rotate 60 degrees around an arbitrary axis passing through (0,1,-1). The x-axis can be aligned to the arbitrary axis after a rotation of 45 degrees around the z-axis, and then 15 degrees around the y-axis.
	translate_to_origin = utils.invertMatrix(utils.MakeTranslateMatrix(0,1,-1));
	align_y_axis = utils.invertMatrix(utils.MakeRotateYMatrix(15));
	align_z_axis = utils.invertMatrix(utils.MakeRotateZMatrix(45));
	rotate_x_axis = utils.MakeRotateXMatrix(60);
	align_z_axis_back = utils.MakeRotateZMatrix(45);
	align_y_axis_back = utils.MakeRotateYMatrix(15);
	translate_back = utils.MakeTranslateMatrix(0,1,-1);

	A1 = utils.multiplyMatrices(translate_back, align_y_axis_back);
	A2 = utils.multiplyMatrices(A1, align_z_axis_back);
	A3 = utils.multiplyMatrices(A2, rotate_x_axis);
	A4 = utils.multiplyMatrices(A3, align_z_axis);
	A5 = utils.multiplyMatrices(A4, align_y_axis);
	A6 = utils.multiplyMatrices(A5, translate_to_origin);

	var R1 = A6;				   
	// Half the size of the object along a line that bisects the positive x and y axes on the xy-plane. 
	align_x_axis = utils.invertMatrix(utils.MakeRotateZMatrix(45));
	scale = utils.MakeScaleMatrix(0.5);
	algin_x_back = utils.MakeRotateZMatrix(45);

	B1 = utils.multiplyMatrices(algin_x_back, scale);
	B2 = utils.multiplyMatrices(B1, align_x_axis);

	var S1 = B2;
			   
	// Mirror the starship along a plane passing through (1,1,1), and obtained rotating 15 degree around the x axis the xz plane
	translate_to_origin = utils.invertMatrix(utils.MakeTranslateMatrix(1,1,1));
	rotate_x = utils.invertMatrix(utils.MakeRotateXMatrix(15));
	scale = utils.MakeScaleNuMatrix(1,-1,1);
	rotate_x_back = utils.MakeRotateXMatrix(15);
	translate_back = utils.MakeTranslateMatrix(1,1,1);


	C1 = utils.multiplyMatrices(translate_back, rotate_x_back);
	C2 = utils.multiplyMatrices(C1, scale);
	C3 = utils.multiplyMatrices(C2, rotate_x);
	C4 = utils.multiplyMatrices(C3, translate_to_origin);

	var S2 =  C4;
			   
	// Apply the inverse of the following sequence of transforms: rotation of 30 degree around the Y axis then Translation of (0, 0, 5), and finally a uniform scaling of a factor of 3.
	var I1 =  [1.0,		0.0,		0.0,		0.0,
			   0.0,		1.0,		0.0,		0.0,
			   0.0,		0.0,		1.0,		0.0,
			   0.0,		0.0,		0.0,		1.0];

	return [R1, S1, S2, I1];
}

function move() {
	// Rotate 60 degrees around an arbitrary axis passing through (0,1,-1). The x-axis can be aligned to the arbitrary axis after a rotation of 45 degrees around the z-axis, and then 15 degrees around the y-axis.
	var translate_to_origin = utils.invertMatrix(utils.MakeTranslateMatrix(0,1,-1));
	var align_y_axis = utils.invertMatrix(utils.MakeRotateYMatrix(15));
	var align_z_axis = utils.invertMatrix(utils.MakeRotateZMatrix(45));
	var rotate_x_axis = utils.MakeRotateXMatrix(60);
	var align_z_axis_back = utils.MakeRotateZMatrix(45);
	var align_y_axis_back = utils.MakeRotateYMatrix(15);
	var translate_back = utils.MakeTranslateMatrix(0,1,-1);

	var A1 = utils.multiplyMatrices(translate_back, align_y_axis_back);
	var A2 = utils.multiplyMatrices(A1, align_z_axis_back);
	var A3 = utils.multiplyMatrices(A2, rotate_x_axis);
	var A4 = utils.multiplyMatrices(A3, align_z_axis);
	var A5 = utils.multiplyMatrices(A4, align_y_axis);
	var A6 = utils.multiplyMatrices(A5, translate_to_origin);

	var R1 = A6;				   
	// Half the size of the object along a line that bisects the positive x and y axes on the xy-plane. 
	var rotate_x = utils.invertMatrix(utils.MakeRotateZMatrix(45));
	var scale = utils.MakeScaleNuMatrix(0.5,1,1);
	var rotate_x_back = utils.MakeRotateZMatrix(45);

	var B1 = utils.multiplyMatrices(rotate_x_back, scale);
	var B2 = utils.multiplyMatrices(B1, rotate_x);

	var S1 = B2;
			   
	// Mirror the starship along a plane passing through (1,1,1), and obtained rotating 15 degree around the x axis the xz plane
	var translate_to_origin = utils.invertMatrix(utils.MakeTranslateMatrix(1,1,1));
	var rotate_x = utils.invertMatrix(utils.MakeRotateXMatrix(15));
	var scale = utils.MakeScaleNuMatrix(1,-1,1);
	var rotate_x_back = utils.MakeRotateXMatrix(15);
	var translate_back = utils.MakeTranslateMatrix(1,1,1);

	var C1 = utils.multiplyMatrices(translate_back, rotate_x_back);
	var C2 = utils.multiplyMatrices(C1, scale);
	var C3 = utils.multiplyMatrices(C2, rotate_x);
	var C4 = utils.multiplyMatrices(C3, translate_to_origin);

	var S2 =  C4;
			   
	// Apply the inverse of the following sequence of transforms: rotation of 30 degree around the Y axis then Translation of (0, 0, 5), and finally a uniform scaling of a factor of 3.
	var scale = utils.invertMatrix(utils.MakeScaleMatrix(3));
	var translation = utils.invertMatrix(utils.MakeTranslateMatrix(0,0,5));
	var rotate_y = utils.invertMatrix(utils.MakeRotateYMatrix(30));

	var D1 = utils.multiplyMatrices(rotate_y, translation);
	var D2 = utils.multiplyMatrices(D1, scale);

	var I1 =  D2;

	return [R1, S1, S2, I1];
}

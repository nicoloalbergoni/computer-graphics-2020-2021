function world() {
	// Positioned in 0,0,-3. Yaw=90, Pitch and Roll = 0
	yaw1 = utils.MakeRotateYMatrix(90);
	translation1 = utils.MakeTranslateMatrix(0,0,-3);

	var A1 =  utils.multiplyMatrices(translation1, yaw1);
			   
	// Positioned in 0,2,0. Yaw=0, Pitch = 60, Roll = 0, 1/10th of size

	scale2 = utils.MakeScaleMatrix(1/10);
	pitch2 = utils.MakeRotateXMatrix(60);
	translation2 = utils.MakeTranslateMatrix(0,2,0);

	B1 = utils.multiplyMatrices(translation2, pitch2);
	B2 = utils.multiplyMatrices(B1, scale2);

	var A2 =  B2;
			   
	// Positioned in 0,0,0. Yaw=30, Pitch = 0 Roll = 45 
	roll3 = utils.MakeRotateZMatrix(45);
	yaw3 = utils.MakeRotateYMatrix(30);


	var A3 =  utils.multiplyMatrices(yaw3, roll3);
			   
	// Positioned in 2,0,2. Yaw=180, Pitch and Roll = 0, two times wider

	scale4 = utils.MakeScaleNuMatrix(2, 1, 1);
	yaw4 = utils.MakeRotateYMatrix(180);
	translation4 = utils.MakeTranslateMatrix(2,0,2);

	C1 = utils.multiplyMatrices(translation4, yaw4);
	C2 = utils.multiplyMatrices(C1, scale4);

	var A4 =  C2;

	// Positioned in 1,-1,2.5. Yaw=-30, Pitch = 45 Roll = -15, Scaled with the following factors: 0.8 (x), 0.75 (y), 1.2 (z)
	scale5 = utils.MakeScaleNuMatrix(0.8, 0.75, 1.2);
	roll5 = utils.MakeRotateZMatrix(-15);
	pitch5 = utils.MakeRotateXMatrix(45);
	yaw5 = utils.MakeRotateYMatrix(-30);
	translation5 = utils.MakeTranslateMatrix(1,-1,2.5);

	D1 = utils.multiplyMatrices(translation5, yaw5);
	D2 = utils.multiplyMatrices(D1, pitch5);
	D3 = utils.multiplyMatrices(D2, roll5);
	D4 = utils.multiplyMatrices(D3, scale5);

	var A5 =  D4;

	return [A1, A2, A3, A4, A5];
}
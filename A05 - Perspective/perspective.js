function makePerspProjectionMatrix(fov, a = 16/9, n = 1, f = 101) {
	fov_rad = utils.degToRad(fov);
	return [
		1/(a * Math.tan(fov_rad /2)), 0, 0, 0,
		0, 1/Math.tan(fov_rad/2), 0, 0,
		0, 0, (f + n) / (n - f), (2*f*n)/(n -f),
		0, 0, -1, 0 
	];
}


function perspective() {


	// Make perspective projection, FoV-y = 70 deg, a = 16/9, n = 1, f = 101.
	var A1 =  makePerspProjectionMatrix(70);
			   
	// Make perspective projection, FoV-y = 105 deg, a = 16/9, n = 1, f = 101
	var A2 =  makePerspProjectionMatrix(105);
			   
	// Make perspective projection, FoV-y = 40 deg, a = 16/9, n = 1, f = 101
	var A3 =  makePerspProjectionMatrix(40);
			   
	// Make perspective projection, FoV-y = 90 deg, a = 4/3, n = 1, f = 101. Note: since the aspect ratio is not correct, the image should appear to be deformed
	var O1 =  makePerspProjectionMatrix(90, 4/3);

	// Make perspective projection, l = -1.2, r = 0, t = 0.3375, b = -0.3375, n = 1, f = 101. Note: due to the asimmetry of this projection, only the left part of the scene should be visible
	l = -1.2;
	r = 0;
	t = 0.3375;
	b = -0.3375;
	n = 1;
	f = 101;

	var O2 =  [(2*n)/(r-l),	0.0,		(r+l)/(r-l),		0.0,
			   0.0,		(2*n)/(t-b),		(t+b)/(t-b),		0.0,
			   0.0,		0.0,		(f+n)/(n-f),		(2*n*f)/(n-f),
			   0.0,		0.0,		-1,		0.0];

	return [A1, A2, A3, O1, O2];
}
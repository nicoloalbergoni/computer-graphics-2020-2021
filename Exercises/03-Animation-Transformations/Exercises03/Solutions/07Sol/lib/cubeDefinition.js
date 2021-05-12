//3D cube vertex coordinates and indices

var vertices = [					// Vertex #:
	 0.4, 0.4,-0.4, 	//  0
	 0.4,-0.4,-0.4,  //  1
	-0.4, 0.4,-0.4,  //  2
	 0.4, 0.4, 0.4,  //  3
	-0.4, 0.4, 0.4,  //  4
	 0.4,-0.4, 0.4,  //  5
	 0.4, 0.4,-0.4,  //  6
	 0.4, 0.4, 0.4,  //  7
	 0.4,-0.4,-0.4,  //  8
	 0.4,-0.4,-0.4,  //  9
	 0.4,-0.4, 0.4,  // 10
	-0.4,-0.4,-0.4,  // 11
	-0.4,-0.4,-0.4,  // 12
	-0.4,-0.4, 0.4,  // 13
	-0.4, 0.4,-0.4,  // 14
	 0.4, 0.4, 0.4,  // 15
	 0.4, 0.4,-0.4,  // 16
	-0.4, 0.4, 0.4,  // 17
	-0.4,-0.4,-0.4,  // 18
	-0.4,-0.4, 0.4,  // 19
	 0.4,-0.4, 0.4,  // 20
	-0.4,-0.4, 0.4,  // 21
	-0.4, 0.4, 0.4,  // 22
	-0.4, 0.4,-0.4   // 23
];

var indices = [ 	// Face #:
	  0,  1,  2,	//  0
	  1, 18,  2,    //  1
	  3,  4,  5,    //  2
	  4, 19,  5,    //  3
	  6,  7,  8,    //  4
	  7, 20,  8,    //  5
	  9, 10, 11,    //  6
	 10, 21, 11,    //  7
	 12, 13, 14,    //  8
	 13, 22, 14,    //  9
	 15, 16, 17,    // 10
	 16, 23, 17     // 11
];

var colors = [					// Color #:
	0.0, 1.0, 1.0, 	//  0
	0.0, 1.0, 1.0,  //  1
	0.0, 1.0, 1.0,  //  2
	0.0, 0.0, 1.0,  //  3
	0.0, 0.0, 1.0,  //  4
	0.0, 0.0, 1.0,  //  5
	1.0, 0.0, 0.0,  //  6
	1.0, 0.0, 0.0,  //  7
	1.0, 0.0, 0.0,  //  8
	1.0, 1.0, 0.0,  //  9
	1.0, 1.0, 0.0,  // 10
	1.0, 1.0, 0.0,  // 11
	1.0, 0.0, 1.0,  // 12
	1.0, 0.0, 1.0,  // 13
	1.0, 0.0, 1.0,  // 14
	0.0, 1.0, 0.0,  // 15
	0.0, 1.0, 0.0,  // 16
	0.0, 1.0, 0.0,  // 17
	0.0, 1.0, 1.0,  // 18
	0.0, 0.0, 1.0,  // 19
	1.0, 0.0, 0.0,  // 20
	1.0, 1.0, 0.0,  // 21
	1.0, 0.0, 1.0,  // 22
	0.0, 1.0, 0.0   // 23
];
	  
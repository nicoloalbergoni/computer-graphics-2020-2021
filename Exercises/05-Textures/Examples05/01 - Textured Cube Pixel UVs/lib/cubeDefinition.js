//3D cube vertex coordinates and indices
var vertices = 
[ // X, Y, Z          
	//Top
	-1.0, 1.0, -1.0,   
	-1.0, 1.0, 1.0,    
	1.0, 1.0, 1.0,     
	1.0, 1.0, -1.0,    
	
  //Left
	-1.0, 1.0, 1.0,    
	-1.0, -1.0, 1.0,   
	-1.0, -1.0, -1.0,  
	-1.0, 1.0, -1.0,   
	
  //Right 
	1.0, 1.0, 1.0,    
	1.0, -1.0, 1.0,   
	1.0, -1.0, -1.0,  
	1.0, 1.0, -1.0,   
	
  //Front 
	1.0, 1.0, 1.0,    
	1.0, -1.0, 1.0,    
	-1.0, -1.0, 1.0,    
	-1.0, 1.0, 1.0,    
	
  //Back
	1.0, 1.0, -1.0,    
	1.0, -1.0, -1.0,    
	-1.0, -1.0, -1.0,    
	-1.0, 1.0, -1.0,    
	// Bottom
	-1.0, -1.0, -1.0,   
	-1.0, -1.0, 1.0,    
	1.0, -1.0, 1.0,     
	1.0, -1.0, -1.0  
];

var indices =
[
	// Top
  0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];

var uv =
[
  //Up
  28.0/632.0, 212.0/640.0,
  28.0/632.0, 582.0/640.0,
  132.0/632.0, 582.0/640.0,
  132.0/632.0, 212.0/640.0,
  // Left
  28.0/632.0, 212.0/640.0,
  132.0/632.0, 212.0/640.0,
  132.0/632.0, 582.0/640.0,
  28.0/632.0, 582.0/640.0,
  
  // Right
  132.0/632.0, 582.0/640.0,
  28.0/632.0, 582.0/640.0,
  28.0/632.0, 212.0/640.0,
  132.0/632.0, 212.0/640.0,
  
  // Front
  132.0/632.0, 582.0/640.0,
  132.0/632.0, 212.0/640.0,
  28.0/632.0, 212.0/640.0,
  28.0/632.0, 582.0/640.0,
  
  // Back
  28.0/632.0, 212.0/640.0,
  28.0/632.0, 582.0/640.0,
  132.0/632.0, 582.0/640.0,
  132.0/632.0, 212.0/640.0,
  
  // Bottom
  132.0/632.0, 582.0/640.0,
  132.0/632.0, 212.0/640.0,
  28.0/632.0, 212.0/640.0,
  28.0/632.0, 582.0/640.0
];
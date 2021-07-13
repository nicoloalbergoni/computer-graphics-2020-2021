function draw() {
	// line(x1,y1, x2,y2)
	// draws a line from a point at Normalized screen coordinates x1,y1 to Normalized screen coordinates x2,y2

	line(-0.5, 0.3, 0.3, 0.3); // Top Line
	line(-0.5, -0.3, 0.3, -0.3); // Bottom Line
	line(-0.5, 0.3, -0.5, -0.3); // Left Line
	
	//Round Part
	for (let i = 0; i <= 64; i++) {

			let x1 = 0.3 * (1 + Math.sin(Math.PI * i/64));
			let y1 =  0.3 * (Math.cos(Math.PI * i/64));

			let x2 = 0.3 * (1 + Math.sin(Math.PI * (i + 1)/64));
			let y2 =  0.3 * (Math.cos(Math.PI * (i + 1)/64));

			line(x1, y1, x2, y2);
	}
}

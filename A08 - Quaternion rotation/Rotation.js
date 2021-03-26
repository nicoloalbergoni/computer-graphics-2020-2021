// these global variables are used to contain the current angles of the world
// HERE YOU WILL HAVE TO ADD ONE OR MORE GLOBAL VARIABLES TO CONTAIN THE ORIENTATION
// OF THE OBJECT


// this function returns the world matrix with the updated rotations.
// parameters rvx, rvy and rvz contains a value in the degree that how much the object rotates in the given direction.
let q = Quaternion.fromEuler(0, 0, 0, order="ZXY");

// Pitch = 0;
// Yaw = 0;
// Roll = 0;

function updateWorld(rvx, rvy, rvz) {

	let delta_q = Quaternion.fromEuler(utils.degToRad(rvz), utils.degToRad(rvx), utils.degToRad(rvy), order='ZXY');
	q = delta_q.mul(q);

	// compute the rotation matrix
	// Pitch = Pitch + rvx;
	// Yaw = Yaw + rvy;
	// Roll = Roll + rvz;
	// var out = utils.MakeWorld(0,0,0, Yaw, Pitch, Roll, 1);

	return q.toMatrix4();
}


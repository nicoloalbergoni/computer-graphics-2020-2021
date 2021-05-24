function Anim1(t) {
	// moving car
	var out = utils.MakeTranslateMatrix(t,0,0);
	return out;
}

function Anim2(t) {
	// bumping code
	var out = utils.identityMatrix();
	return out;
}

function Anim3(t) {
	// rotating fan
	var out = utils.identityMatrix();
	return out;
}

function Anim4(t) {
	// buring flame
	var out = utils.identityMatrix();
	return out;
}

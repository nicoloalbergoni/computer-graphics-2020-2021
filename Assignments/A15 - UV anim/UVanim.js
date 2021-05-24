function Anim1(t) {
	// moving car
	// Scale the coordinates by 0.25 and move them to the part that is needed
	let scale = utils.MakeScaleNuMatrix(0.25, 0.25, 1);
	let translation = utils.MakeTranslateMatrix(0, 0.5, 0);
	let temp = utils.multiplyMatrices(translation, scale);
	
	var out = utils.multiplyMatrices(temp, utils.MakeTranslateMatrix(t,0,0));
	return out;
}

function Anim2(t) {
	// bumping code

	// Scale the coordinates by 0.25 and move them to the part that is needed
	let scale = utils.MakeScaleNuMatrix(0.25, 0.25, 1);
	let translation = utils.MakeTranslateMatrix(0.75, 0.5, 0);
	let temp = utils.multiplyMatrices(translation, scale);

	let value = Math.abs((t - 0.5) * 2);	 
	var out = utils.multiplyMatrices(temp, utils.MakeTranslateMatrix(0, value, 0));
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


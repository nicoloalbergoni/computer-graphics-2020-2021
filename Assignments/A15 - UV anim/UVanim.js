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

	let scale = utils.MakeScaleNuMatrix(0.25, 0.25, 1);
	let translation = utils.MakeTranslateMatrix(0.5, 0.75, 0);
	let temp = utils.multiplyMatrices(translation, scale);

	let axisToOrigin = utils.invertMatrix(utils.MakeTranslateMatrix(0.625, 0.875, 0));
	let alignX = utils.invertMatrix(utils.MakeRotateYMatrix(90));
	let rotation = utils.MakeRotateXMatrix(t * 360.0);
	let alignBackX = utils.MakeRotateYMatrix(90);
	let axisBack = utils.MakeTranslateMatrix(0.625, 0.875, 0);

	let A = utils.multiplyMatrices(alignX, axisToOrigin);
	let B = utils.multiplyMatrices(rotation, A);
	let C = utils.multiplyMatrices(alignBackX, B);
	let D = utils.multiplyMatrices(axisBack, C);

	let out = utils.multiplyMatrices(D, temp);
	
	return out;
}

function Anim4(t) {
	// buring flame

	let scale = utils.MakeScaleNuMatrix(0.0625, 0.0625, 1);
	let translation = utils.MakeTranslateMatrix(0, 0, 0);
	let temp = utils.multiplyMatrices(translation, scale);

	let out = utils.multiplyMatrices(temp, utils.MakeTranslateMatrix(t, 0, 0));
	
	return out;
}


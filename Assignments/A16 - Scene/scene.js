function drawSceneTree(S) {	
	let rootWorld = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(
		utils.MakeTranslateMatrix(S[0][0], S[0][1], S[0][2]),
		utils.MakeRotateZMatrix(S[0][5])),
		utils.MakeRotateXMatrix(S[0][3])),
		utils.MakeRotateYMatrix(S[0][4]));
		draw(0, rootWorld);

		drawChildren(S, 0, rootWorld);
}

function drawChildren(S, id, parentWorld) {
	let startIndex = S[id][6];
	let endIndex = S[id][7];

	if (startIndex != -1) {
		for (let j = startIndex; j <= endIndex; j++) {
			let childWorld = utils.multiplyMatrices(utils.multiplyMatrices(utils.multiplyMatrices(
				utils.MakeTranslateMatrix(S[j][0], S[j][1], S[j][2]),
				utils.MakeRotateZMatrix(S[j][5])),
				utils.MakeRotateXMatrix(S[j][3])),
				utils.MakeRotateYMatrix(S[j][4]));	

				let prod = utils.multiplyMatrices(parentWorld, childWorld);
				draw(j, prod);			
				drawChildren(S, j, prod);			
		}
	} 
}


function shaders() {
// The shader can find the required informations in the following variables:

//vec3 fs_pos;		// Position of the point in 3D space
//
//float SpecShine;		// specular coefficient for both Blinn and Phong
//float DToonTh;		// Threshold for diffuse in a toon shader
//float SToonTh;		// Threshold for specular in a toon shader
//
//vec4 diffColor;		// diffuse color
//vec4 ambColor;		// material ambient color
//vec4 specularColor;		// specular color
//vec4 emit;			// emitted color
//	
//vec3 normalVec;		// direction of the normal vecotr to the surface
//vec3 eyedirVec;		// looking direction
//
//
// Lighr directions can be found into:
//vec3 lightDirA;
//vec3 lightDirB;
//vec3 lightDirC;
//
//and intensity is returned into:
//
//vec4 lightColorA;
//vec4 lightColorB;
//vec4 lightColorC;
//
// Ambient light contribution can be found intop
//
// vec4 ambientLight;

//TODO: Finished
// Lambert diffuse and Ambient material. No specular or emisssion.
var S1 = `
	vec4 LAcontr = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LBcontr = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LCcontr = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;
	out_color = clamp(diffColor * (LAcontr + LBcontr + LCcontr) + ambientLight * ambColor, 0.0, 1.0);
`;

//TODO: Finished
// Lambert diffuse and Blinn specular. No ambient and emission.
var S2 = `
	vec4 LA_diffuse = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LB_diffuse = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LC_diffuse = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;

	vec4 diffuse = diffColor * (LA_diffuse + LB_diffuse + LC_diffuse);

	vec3 half_LA = normalize(lightDirA + eyedirVec);
	vec3 half_LB = normalize(lightDirB + eyedirVec);
	vec3 half_LC = normalize(lightDirC + eyedirVec);

	vec4 LA_specular = pow(clamp(dot(normalVec, half_LA), 0.0, 1.0), SpecShine) * lightColorA;
	vec4 LB_specular = pow(clamp(dot(normalVec, half_LB), 0.0, 1.0), SpecShine) * lightColorB;
	vec4 LC_specular = pow(clamp(dot(normalVec, half_LC), 0.0, 1.0), SpecShine) * lightColorC;

	vec4 specular = specularColor * (LA_specular + LB_specular + LC_specular);

	out_color = clamp(diffuse + specular, 0.0, 1.0);
`;

//TODO: Finished
// Ambient and Phong specular. No emssion and no diffuse.
var S3 = `
	vec3 reflect_LA = -reflect(lightDirA, normalVec);
	vec3 reflect_LB = -reflect(lightDirB, normalVec);
	vec3 reflect_LC = -reflect(lightDirC, normalVec);

	vec4 LA_specular = pow(clamp(dot(eyedirVec, reflect_LA), 0.0, 1.0), SpecShine) * lightColorA;
	vec4 LB_specular = pow(clamp(dot(eyedirVec, reflect_LB), 0.0, 1.0), SpecShine) * lightColorB;
	vec4 LC_specular = pow(clamp(dot(eyedirVec, reflect_LC), 0.0, 1.0), SpecShine) * lightColorC;

	vec4 specular = specularColor * (LA_specular + LB_specular + LC_specular);
	vec4 ambient = ambientLight * ambColor;

	out_color = clamp(specular + ambient, 0.0, 1.0);
`;

//TODO: Lambert Diffuse ?
// Diffuse, ambient, emission and Phong specular.
var S4 = `
	vec4 LA_diffuse = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LB_diffuse = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LC_diffuse = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;

	vec4 diffuse = diffColor * (LA_diffuse + LB_diffuse + LC_diffuse);

	vec3 reflect_LA = -reflect(lightDirA, normalVec);
	vec3 reflect_LB = -reflect(lightDirB, normalVec);
	vec3 reflect_LC = -reflect(lightDirC, normalVec);

	vec4 LA_specular = pow(clamp(dot(eyedirVec, reflect_LA), 0.0, 1.0), SpecShine) * lightColorA;
	vec4 LB_specular = pow(clamp(dot(eyedirVec, reflect_LB), 0.0, 1.0), SpecShine) * lightColorB;
	vec4 LC_specular = pow(clamp(dot(eyedirVec, reflect_LC), 0.0, 1.0), SpecShine) * lightColorC;

	vec4 specular = specularColor * (LA_specular + LB_specular + LC_specular);

	vec4 ambient = ambientLight * ambColor;

	out_color = clamp(diffuse + specular + ambient + emit, 0.0, 1.0);
`;

//TODO: Are the formula correct ? Do i need to clamp the value for the thresholds ?
// Ambient, Toon diffuse and and Toon (Blinn based) specular. No emssion.
var S5 = `

	vec4 LA_diffuse = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LB_diffuse = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LC_diffuse = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;

	vec4 toon_diff_LA = max(0.0, sign(dot(lightDirA, normalVec) - DToonTh)) * diffColor;
	vec4 toon_diff_LB = max(0.0, sign(dot(lightDirB, normalVec) - DToonTh)) * diffColor;
	vec4 toon_diff_LC = max(0.0, sign(dot(lightDirC, normalVec) - DToonTh)) * diffColor;

	vec4 diffuse = (LA_diffuse * toon_diff_LA) + (LB_diffuse * toon_diff_LB) + (LC_diffuse * toon_diff_LC);

	vec3 half_LA = normalize(lightDirA + eyedirVec);
	vec3 half_LB = normalize(lightDirB + eyedirVec);
	vec3 half_LC = normalize(lightDirC + eyedirVec);

	vec4 LA_specular = pow(clamp(dot(normalVec, half_LA), 0.0, 1.0), 1.0) * lightColorA;
	vec4 LB_specular = pow(clamp(dot(normalVec, half_LB), 0.0, 1.0), 1.0) * lightColorB;
	vec4 LC_specular = pow(clamp(dot(normalVec, half_LC), 0.0, 1.0), 1.0) * lightColorC;

	vec4 toon_spec_LA = max(0.0, sign(dot(normalVec, half_LA) - SToonTh)) * specularColor;
	vec4 toon_spec_LB = max(0.0, sign(dot(normalVec, half_LB) - SToonTh)) * specularColor;
	vec4 toon_spec_LC = max(0.0, sign(dot(normalVec, half_LC) - SToonTh)) * specularColor;

	vec4 specular = (toon_spec_LA * LA_specular) + (toon_spec_LB * LB_specular) + (toon_spec_LC * LC_specular);

	vec4 ambient = ambientLight * ambColor;

	out_color = clamp(diffuse + specular + ambient, 0.0, 1.0);
`;

	return [S1, S2, S3, S4, S5];
}


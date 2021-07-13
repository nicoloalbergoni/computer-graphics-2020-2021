function shaders() {
// The shader can find the required informations in the following variables:

//vec3 fs_pos;		// Position of the point in 3D space
//
//vec3  Pos;		// Position of first (or single) light
//vec3  Dir;		// Direction of first (or single) light
//float ConeOut;	// Outer cone (in degree) of the light (if spot)
//float ConeIn;		// Inner cone (in percentage of the outher cone) of the light (if spot)
//float Decay;		// Decay factor (0, 1 or 2)
//float Target;		// Target distance
//vec4  lightColor;	// color of the first light
//		
//
//vec4 ambientLightColor;		// Ambient light color. For hemispheric, this is the color on the top
//vec4 ambientLightLowColor;	// For hemispheric ambient, this is the bottom color
//vec3 ADir;					// For hemispheric ambient, this is the up direction
//vec4 SHconstColor;		// For spherical harmonics, constant term
//vec4 SHDeltaLxColor;		// For spherical harmonics, DeltaLx color
//vec4 SHDeltaLyColor;		// For spherical harmonics, DeltaLy color
//vec4 SHDeltaLzColor;		// For spherical harmonics, DeltaLz color
//
//vec3 normalVec;				// direction of the normal vector to the surface
//
//
// Final direction and colors are returned into:
//vec3 OlightDir;
//
//and intensity is returned into:
//
//vec4 OlightColor;
//
// Ambient light contribution is returned into
//
// vec4 ambientColor;

// Single directional light, constant ambient
var S1 = `
	OlightDir = Dir;
	OlightColor = lightColor;
	
	ambientColor = ambientLightColor;
`;

// Single point light without decay
var S2 = `
	OlightDir = normalize(Pos - fs_pos);
	OlightColor = lightColor;
`;

// Single spot light (without decay), constant ambient
var S3 = `
	vec3 light_dir_n = normalize(Pos - fs_pos);
	float final_ConeOut = cos(radians(ConeOut/2.0));
	float final_ConeIn = cos(radians((ConeOut * ConeIn)/2.0));
	float final_color_clamp = clamp((dot(light_dir_n, Dir) - final_ConeOut) / (final_ConeIn - final_ConeOut), 0.0, 1.0);
	vec4 final_color = lightColor * final_color_clamp;

	OlightDir = light_dir_n;
	OlightColor = final_color;
	ambientColor = ambientLightColor;
`;

// Single point light with decay
var S4 = `
	vec3 light_dir_n = normalize(Pos - fs_pos);
	float decay_factor = pow((Target / length(Pos - fs_pos)), Decay);
	vec4 final_color = lightColor * decay_factor;

	OlightColor = final_color;
	OlightDir = light_dir_n;
`;

// Single spot light (with decay)
var S5 = `
	vec3 light_dir_n = normalize(Pos - fs_pos);
	float final_ConeOut = cos(radians(ConeOut/2.0));
	float final_ConeIn = cos(radians((ConeOut * ConeIn)/2.0));
	float final_color_clamp = clamp((dot(light_dir_n, Dir) - final_ConeOut) / (final_ConeIn - final_ConeOut), 0.0, 1.0);
  float decay_factor = pow((Target / length(Pos - fs_pos)), Decay);

  vec4 final_color = lightColor * decay_factor * final_color_clamp;

	OlightColor = final_color;
	OlightDir = light_dir_n;

`;

// Single point light, hemispheric ambient 
var S6 = `
  vec3 light_dir_n = normalize(Pos - fs_pos);
  float cos_alpha = dot(normalVec, ADir);
  vec4 hem_ambient = (((cos_alpha + 1.0) / 2.0) * ambientLightColor) + (((1.0 - cos_alpha) / 2.0) * ambientLightLowColor);


  OlightColor = lightColor;
	OlightDir = light_dir_n;
  ambientColor = hem_ambient;
`;

// Single spot light, spherical harmonics ambient
var S7 = `
  vec3 light_dir_n = normalize(Pos - fs_pos);
  float final_ConeOut = cos(radians(ConeOut/2.0));
  float final_ConeIn = cos(radians((ConeOut * ConeIn)/2.0));
  float final_color_clamp = clamp((dot(light_dir_n, Dir) - final_ConeOut) / (final_ConeIn - final_ConeOut), 0.0, 1.0);
  vec4 final_color = lightColor * final_color_clamp;

  vec4 spherical_ambient = SHconstColor + (normalVec.x * SHDeltaLxColor) + (normalVec.y * SHDeltaLyColor) + (normalVec.z * SHDeltaLzColor);

  OlightDir = light_dir_n;
  OlightColor = final_color;
  ambientColor = spherical_ambient;
`;
	return [S1, S2, S3, S4, S5, S6, S7];
}


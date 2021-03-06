/*@config{
	"version": 1,
	"params":{
		"strength":{
			"input": "default",
			"type": "float",
			"dim": 1
		},
		"imgSize":{
			"input": "imgSize"
		},
		"heightMode":{
			"input": "enum",
			"enumValues": ["luminance", "sum", "red", "green", "blue"]
		},
		"normalMode":{
			"input": "enum",
			"enumValues": ["old", "new"]
		}
	}
}*/
precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform vec2 imgSize;

uniform float strength;
uniform int heightMode;
uniform int normalMode;

float getHeight(vec4 color){
	float result = 0.0;

	if(heightMode == 0){
		result=dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
	}else if(heightMode == 1){
		result = (color.r + color.g + color.b)/3.0;
	}else if(heightMode == 2){
		result = color.r;
	}else if(heightMode == 3){
		result = color.g;
	}else if(heightMode == 4){
		result = color.b;
	}

	return result;
}

void main(){
	vec2 delta = vec2(0.0);

	if(normalMode==0){
		float height = getHeight(texture2D(tex, UV));
		float heightX = getHeight(texture2D(tex, UV + vec2(1.0/imgSize.x, 0.0)));
		float heightY = getHeight(texture2D(tex, UV + vec2(0.0, 1.0/imgSize.y)));
		delta = vec2(heightX - height, heightY - height) * strength / imgSize;
	}else{
		float heightX0 = getHeight(texture2D(tex, UV - vec2(1.0/imgSize.x, 0.0)));
		float heightY0 = getHeight(texture2D(tex, UV - vec2(0.0, 1.0/imgSize.y)));
		float heightX1 = getHeight(texture2D(tex, UV + vec2(1.0/imgSize.x, 0.0)));
		float heightY1 = getHeight(texture2D(tex, UV + vec2(0.0, 1.0/imgSize.y)));
		delta = vec2(heightX1 - heightX0, heightY1 - heightY0) * strength / imgSize;
	}

	gl_FragColor = texture2D(tex, (UV+delta));
}

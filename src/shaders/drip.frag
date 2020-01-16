/*@config{
	"version": 1,
	"params": {
		"heightMode": {
			"input": "enum",
			"enumValues": ["luminance", "sum", "red", "green", "blue"]
		},
		"mode": {
			"input": "enum",
			"enumValues": ["brighten", "darken"]
		},
		"imgSize": {
			"input": "imgSize"
		},
		"direction": {
			"input": "angle"
		},
		"strength": {
			"input": "default",
			"dim": 1,
			"type": "float"
		},
		"mult": {
			"input": "default",
			"dim": 1,
			"type": "float"
		}
	}
}*/
precision highp float;

varying vec2 UV;

uniform sampler2D tex;

uniform int heightMode;
uniform int mode;
uniform vec2 imgSize;
uniform float direction;
uniform float strength;
uniform float mult;

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

	if(mode==1){
		result=1.0-result;
	}

	return result;
}

void main(){
	vec2 delta = strength*vec2(cos(direction), -sin(direction))/imgSize;

	vec4 myColor = texture2D(tex, UV);
	vec4 targetColor = texture2D(tex, UV+delta);

	if(mult*getHeight(targetColor)>=getHeight(myColor)){
		gl_FragColor = mult*targetColor+(1.0-mult)*myColor;
	}else{
		gl_FragColor = myColor;
	}
}
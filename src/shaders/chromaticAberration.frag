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
		"mode":{
			"input": "enum",
			"enumValues": ["standard", "scale by luminance"]
		},
		"angle":{
			"input": "angle"
		}
	}
}*/precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform vec2 imgSize;

uniform float strength;
uniform int mode;
uniform float angle;

void main(){
	vec4 gColor=texture2D(tex, UV);

	float str = strength/imgSize.x;
	if(mode==1){
		str*=dot(vec3(0.2126, 0.7152, 0.0722), gColor.rgb);
	}

	vec2 delta = str*vec2(cos(angle), sin(angle));

	vec4 rColor = texture2D(tex, UV-delta);
	vec4 bColor = texture2D(tex, UV+delta);

	gl_FragColor = vec4(rColor.r, gColor.g, bColor.b, 1.0);
}

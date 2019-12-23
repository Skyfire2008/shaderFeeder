/*@config{
	"version": 1,
	"params": {
		"strength": {
			"dim": 3,
			"type": "float",
			"input": "default"
		}
	}
}*/

precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform vec3 strength;

void main(){
	//gl_FragColor.rgba = texture2D(tex, UV).gbra;
	gl_FragColor.gbra = texture2D(tex, UV)*vec4(strength, 1.0);
}
/*@config{
	"version": 1,
	"params": {
		"red": {
			"input": "enum",
			"enumValues": ["red", "green", "blue"]
		},
		"green": {
			"input": "enum",
			"enumValues": ["red", "green", "blue"]
		},
		"blue": {
			"input": "enum",
			"enumValues": ["red", "green", "blue"]
		}
	}
}*/

precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform int red;
uniform int green;
uniform int blue;

float getChannel(vec4 color, int index){
	if(index==0){
		return color.r;
	}else if(index==1){
		return color.g;
	}else if(index==2){
		return color.b;
	}

	return 0.0;
}

void main(){
	vec4 inputColor = texture2D(tex, UV);
	gl_FragColor.a = 1.0;
	gl_FragColor.r = getChannel(inputColor, red);
	gl_FragColor.g = getChannel(inputColor, green);
	gl_FragColor.b = getChannel(inputColor, blue);
}

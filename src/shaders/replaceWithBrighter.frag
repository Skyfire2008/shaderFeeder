/*@config{
	"version": 1,
	"params": {
		"heightMode": {
			"input": "enum",
			"enumValues": ["luminance", "sum", "red", "green", "blue"]
		},
		"imgSize":{
			"input": "imgSize"
		}
	}
}*/
precision highp float;

varying vec2 UV;

uniform sampler2D tex;

uniform int heightMode;
uniform vec2 imgSize;

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

	vec4 myColor = texture2D(tex, UV);
	float myHeight = getHeight(myColor);

	vec4 bestColor = myColor;
	float bestHeight = 1337.0; //just a big number, since glsl has no infinity constant

	for(float i=-1.0; i<=1.0; i+=1.0){
		for(float j=-1.0; j<=1.0; j+=1.0){

			if(!(i==0.0 && j==0.0)){
				vec4 currentColor = texture2D(tex, UV + normalize(vec2(i, j))/imgSize);
				float currentHeight = getHeight(currentColor);

				if(currentHeight>myHeight){
					if(currentHeight<bestHeight){
						bestHeight = currentHeight;
						bestColor = currentColor;
					}
				}
			}

		}
	}

	gl_FragColor = bestColor;
}
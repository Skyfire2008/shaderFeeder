precision highp float;

varying vec2 UV;
uniform sampler2D tex;

void main(){
	gl_FragColor.rgba = texture2D(tex, UV).gbra;
}
attribute vec2 pos;
attribute vec2 texCoords;

varying vec2 UV;

uniform bool flipY;

void main(){
	gl_Position=vec4(pos, 0.0, 1.0);
	UV=(pos+vec2(1.0, 1.0))/2.0;
	if(flipY){
		UV.y=1.0-UV.y;
	}
}

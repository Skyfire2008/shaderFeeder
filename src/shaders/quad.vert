attribute vec2 pos;
attribute vec2 uv;

varying vec2 texCoords;

void main(){
	gl_Position = vec4(pos, 0.0, 1.0);
	texCoords = uv;
}

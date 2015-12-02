
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {

    gl_FragColor = vec4(0.5 * vNormal + 0.5, 1.0);

}


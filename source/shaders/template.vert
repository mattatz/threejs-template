#pragma glslify: noise2d = require(glsl-noise/simplex/2d)
#pragma glslify: noise3d = require(glsl-noise/simplex/3d)

uniform float time;
uniform float noiseSpeed;
uniform float noiseScale;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {

    vec3 pos = position;

    vec3 seed = vec3(pos.xy, pos.z + time * noiseSpeed) * noiseScale;
    pos += (normal * (noise3d(seed))) * 0.05;

    vPosition = pos;
    vNormal = normalize(normalMatrix * normal);
    // vNormal = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz); // same thing as above
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

}


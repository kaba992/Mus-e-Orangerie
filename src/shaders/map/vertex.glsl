varying vec2 vUv;
varying float vFogFactor;
uniform sampler2D uTexture;
uniform float uFogNear;
uniform float uFogFar;

void main() {

    vec4 textureCloud = texture2D(uTexture,vec2(1. - vUv.x, vUv.y));


    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float distance = length(cameraPosition - modelPosition.xyz);
    vFogFactor = (distance - uFogNear) / (uFogFar - uFogNear);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}

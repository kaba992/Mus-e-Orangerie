varying vec2 vUv;
varying float vFogFactor;
uniform sampler2D uTexture;
uniform vec3 uFogColor;

void main()
{

    vec4 textureCloud = texture2D(uTexture,vec2( vUv.x, vUv.y));
    vec3 textureColor = mix(textureCloud.xyz,uFogColor,vFogFactor);
    gl_FragColor = textureCloud;

}
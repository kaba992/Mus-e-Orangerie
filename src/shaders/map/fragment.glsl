varying vec2 vUv;
uniform sampler2D uTexture;

void main()
{

    vec4 textureCloud = texture2D(uTexture,vec2( vUv.x, vUv.y));
    gl_FragColor = textureCloud;

}
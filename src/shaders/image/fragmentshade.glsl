varying vec2 vUv;
uniform float uTime1;


void main()
{

    gl_FragColor = vec4(1.,0.25,0.3,1.)*sin(uTime1*10.);

}
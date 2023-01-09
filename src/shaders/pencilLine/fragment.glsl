
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform sampler2D uNormals;
uniform sampler2D tCloud;
varying vec2 vUv;


vec2 grad( ivec2 z )  // replace this anything that returns a random vector
{
    // 2D to 1D  (feel free to replace by some other)
    int n = z.x+z.y*11111;

    // Hugo Elias hash (feel free to replace by another one)
    n = (n<<13)^n;
    n = (n*(n*n*15731+789221)+1376312589)>>16;

    #if 0

    // simple random vectors
    return vec2(cos(float(n)),sin(float(n)));

    #else

    // Perlin style vectors
    n &= 7;
    vec2 gr = vec2(n&1,n>>1)*2.0-1.0;
    return ( n>=6 ) ? vec2(0.0,gr.x) :
    ( n>=4 ) ? vec2(gr.x,0.0) :
    gr;
    #endif
}

float noise( in vec2 p )
{
    ivec2 i = ivec2(floor( p ));
    vec2 f =       fract( p );

    vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead

    return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ),
    dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),
    mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ),
    dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);
}


float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {
    vec3 luma = vec3(0.299, 0.587, 0.114);
    return dot(texture2D(image, coord + texel * point).xyz, luma);
}

float diffuseValue(int x, int y) {
    return valueAtPoint(tDiffuse, vUv, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;
}

float normalValue(int x, int y) {
    float cutoff = 100.0;
    float offset = 0.1 / cutoff;
    float noiseValue = clamp(texture(tCloud, vUv).r, 0.0, cutoff) / cutoff - offset;

    return valueAtPoint(uNormals, vUv + noiseValue * 0.1, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.3;
}


//float getValue(int x, int y) {
//    return diffuseValue(x, y) + normalValue(x, y);
//}

float getValue(int x, int y) {
    float noiseValue = noise(gl_FragCoord.xy);
    noiseValue = noiseValue * 2.0 - 1.0;
    noiseValue *= 20.0;

    return diffuseValue(x, y) + normalValue(x, y) * noiseValue;
}

float combinedSobelValue() {
    // kernel definition (in glsl matrices are filled in column-major order)
    const mat3 Gx = mat3(
    -1, -2, -1,
    0,  0,  0,
    1,  2,  1
    );// x direction kernel
    const mat3 Gy = mat3(
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1);// y direction kernel

    // fetch the 3x3 neighbourhood of a fragment

    // first column
    float tx0y0 = getValue(-1, -1);
    float tx0y1 = getValue(-1, 0);
    float tx0y2 = getValue(-1, 1);

    // second column
    float tx1y0 = getValue(0, -1);
    float tx1y1 = getValue(0, 0);
    float tx1y2 = getValue(0, 1);

    // third column
    float tx2y0 = getValue(1, -1);
    float tx2y1 = getValue(1, 0);
    float tx2y2 = getValue(1, 1);

    // gradient value in x direction
    float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
    Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
    Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

    // gradient value in y direction
    float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
    Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
    Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

    // magnitude of the total gradient
    float G = (valueGx * valueGx) + (valueGy * valueGy);
    return clamp(G, 0.0, 1.0);
}

void main() {
    float sobelValue = combinedSobelValue();
    sobelValue = smoothstep(0.000000001, 0.03, sobelValue);

    vec4 lineColor = vec4(0.32, 0.12, 0.2, 1.0);

    vec4 textureColor = texture2D(tDiffuse, vUv );

//    gl_FragColor = textureColor;

    if (sobelValue > 0.1) {
        gl_FragColor = lineColor;
    } else {
        gl_FragColor = vec4(0.9294, 0.9020, 0.8235,1.);
//        gl_FragColor = vec4(textureColor);
    }
}
const fragment = '' +
    'uniform sampler2D tDiffuse;\n' +
    'uniform vec2 uResolution;\n' +
    'uniform sampler2D uNormals;\n' +
    'uniform sampler2D tCloud;\n' +
    'varying vec2 vUv;\n' +
    '\n' +
    '\n' +
    'vec2 grad( ivec2 z )  // replace this anything that returns a random vector\n' +
    '{\n' +
    '    // 2D to 1D  (feel free to replace by some other)\n' +
    '    int n = z.x+z.y*11111;\n' +
    '\n' +
    '    // Hugo Elias hash (feel free to replace by another one)\n' +
    '    n = (n<<13)^n;\n' +
    '    n = (n*(n*n*15731+789221)+1376312589)>>16;\n' +
    '\n' +
    '    #if 0\n' +
    '\n' +
    '    // simple random vectors\n' +
    '    return vec2(cos(float(n)),sin(float(n)));\n' +
    '\n' +
    '    #else\n' +
    '\n' +
    '    // Perlin style vectors\n' +
    '    n &= 7;\n' +
    '    vec2 gr = vec2(n&1,n>>1)*2.0-1.0;\n' +
    '    return ( n>=6 ) ? vec2(0.0,gr.x) :\n' +
    '    ( n>=4 ) ? vec2(gr.x,0.0) :\n' +
    '    gr;\n' +
    '    #endif\n' +
    '}\n' +
    '\n' +
    'float noise( in vec2 p )\n' +
    '{\n' +
    '    ivec2 i = ivec2(floor( p ));\n' +
    '    vec2 f =       fract( p );\n' +
    '\n' +
    '    vec2 u = f*f*(3.0-2.0*f); // feel free to replace by a quintic smoothstep instead\n' +
    '\n' +
    '    return mix( mix( dot( grad( i+ivec2(0,0) ), f-vec2(0.0,0.0) ),\n' +
    '    dot( grad( i+ivec2(1,0) ), f-vec2(1.0,0.0) ), u.x),\n' +
    '    mix( dot( grad( i+ivec2(0,1) ), f-vec2(0.0,1.0) ),\n' +
    '    dot( grad( i+ivec2(1,1) ), f-vec2(1.0,1.0) ), u.x), u.y);\n' +
    '}\n' +
    '\n' +
    '\n' +
    'float valueAtPoint(sampler2D image, vec2 coord, vec2 texel, vec2 point) {\n' +
    '    vec3 luma = vec3(0.299, 0.587, 0.114);\n' +
    '\n' +
    '    return dot(texture2D(image, coord + texel * point).xyz, luma);\n' +
    '}\n' +
    '\n' +
    'float diffuseValue(int x, int y) {\n' +
    '    return valueAtPoint(tDiffuse, vUv, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.6;\n' +
    '}\n' +
    '\n' +
    'float normalValue(int x, int y) {\n' +
    '    float cutoff = 100.0;\n' +
    '    float offset = 0.5 / cutoff;\n' +
    '    float noiseValue = clamp(texture(tCloud, vUv).r, 0.0, cutoff) / cutoff - offset;\n' +
    '\n' +
    '    return valueAtPoint(uNormals, vUv + noiseValue, vec2(1.0 / uResolution.x, 1.0 / uResolution.y), vec2(x, y)) * 0.3;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '//float getValue(int x, int y) {\n' +
    '//    return diffuseValue(x, y) + normalValue(x, y);\n' +
    '//}\n' +
    '\n' +
    'float getValue(int x, int y) {\n' +
    '    float noiseValue = noise(gl_FragCoord.xy);\n' +
    '    noiseValue = noiseValue * 2.0 - 1.0;\n' +
    '    noiseValue *= 7.5;\n' +
    '\n' +
    '    return diffuseValue(x, y) + normalValue(x, y) * noiseValue;\n' +
    '}\n' +
    '\n' +
    'float combinedSobelValue() {\n' +
    '    // kernel definition (in glsl matrices are filled in column-major order)\n' +
    '    const mat3 Gx = mat3(\n' +
    '    -1, -2, -1,\n' +
    '    0,  0,  0,\n' +
    '    1,  2,  1\n' +
    '    );// x direction kernel\n' +
    '    const mat3 Gy = mat3(\n' +
    '    -1, 0, 1,\n' +
    '    -2, 0, 2,\n' +
    '    -1, 0, 1);// y direction kernel\n' +
    '\n' +
    '    // fetch the 3x3 neighbourhood of a fragment\n' +
    '\n' +
    '    // first column\n' +
    '    float tx0y0 = getValue(-1, -1);\n' +
    '    float tx0y1 = getValue(-1, 0);\n' +
    '    float tx0y2 = getValue(-1, 1);\n' +
    '\n' +
    '    // second column\n' +
    '    float tx1y0 = getValue(0, -1);\n' +
    '    float tx1y1 = getValue(0, 0);\n' +
    '    float tx1y2 = getValue(0, 1);\n' +
    '\n' +
    '    // third column\n' +
    '    float tx2y0 = getValue(1, -1);\n' +
    '    float tx2y1 = getValue(1, 0);\n' +
    '    float tx2y2 = getValue(1, 1);\n' +
    '\n' +
    '    // gradient value in x direction\n' +
    '    float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +\n' +
    '    Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +\n' +
    '    Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;\n' +
    '\n' +
    '    // gradient value in y direction\n' +
    '    float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +\n' +
    '    Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +\n' +
    '    Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;\n' +
    '\n' +
    '    // magnitude of the total gradient\n' +
    '    float G = (valueGx * valueGx) + (valueGy * valueGy);\n' +
    '    return clamp(G, 0.0, 1.0);\n' +
    '}\n' +
    '\n' +
    'void main() {\n' +
    '    float sobelValue = combinedSobelValue();\n' +
    '    sobelValue = smoothstep(0.000000001, 0.03, sobelValue);\n' +
    '\n' +
    '    vec4 lineColor = vec4(0.32, 0.12, 0.2, 1.0);\n' +
    '\n' +
    '    vec4 textureColor = texture2D(tDiffuse, vUv );\n' +
    '\n' +
    '//    gl_FragColor = textureColor;\n' +
    '\n' +
    '    if (sobelValue > 0.1) {\n' +
    '        gl_FragColor = lineColor;\n' +
    '    } else {\n' +
    '        gl_FragColor = vec4(0.9294, 0.9020, 0.8235,1.);\n' +
    '//        gl_FragColor = vec4(textureColor);\n' +
    '    }\n' +
    '}';

export default fragment;

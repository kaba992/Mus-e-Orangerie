const vertex = 'varying vec2 vUv;\n' +
    '\n' +
    'void main() {\n' +
    '\n' +
    '    vUv = uv;\n' +
    '    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n' +
    '\n' +
    '}\n'

export default vertex;
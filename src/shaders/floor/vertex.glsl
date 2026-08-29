varying vec3 vFakeNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vPosition = position;
    vFakeNormal = normal;
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}

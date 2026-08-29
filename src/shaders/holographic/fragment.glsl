uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    vec3 normal = normalize(vNormal);

    if (!gl_FrontFacing)
        normal *= -1.0;

    vec3 viewDirection = normalize(cameraPosition - vPosition);

    float fresnel = dot(viewDirection, normal);
    fresnel = 1.0 - fresnel;
    fresnel = pow(fresnel, 2.0);

    float stripes = mod((vPosition.y - uTime * 0.01) * 30.0, 1.0);
    stripes = pow(stripes, 3.0);

    float holographic = stripes + fresnel;
    holographic = clamp(holographic, 0.0, 1.0);

    gl_FragColor = vec4(uColor, holographic);
}

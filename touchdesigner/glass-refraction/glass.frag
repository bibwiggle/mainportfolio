// TouchDesigner GLSL MAT pixel shader.
// On the MAT's Samplers page, set uScene to the background TOP.
uniform sampler2D uScene;

in vec3 vCameraNormal;
in vec3 vCameraView;
in vec3 vModelPosition;
layout(location = 0) out vec4 fragColor;

// Starting values from the website's homepage settings.
const float IOR = 1.04;
const float REFRACTION_AMOUNT = 0.07;
const float DISPERSION = 0.045;
const float REFRACTION_MIX = 0.65;

void main()
{
    TDCheckDiscard();
    vec3 normal = normalize(vCameraNormal);
    vec3 view = normalize(vCameraView);
    vec3 faceNormal = TDFrontFacing(-vCameraView, normal) ? normal : -normal;

    // The website's procedural chrome bands and edge highlight. Its moving
    // cylinder light and post-process bloom are separate from this starter.
    float facing = abs(dot(normal, view));
    float fresnel = pow(1.0 - facing, 2.0);
    float reflection = dot(reflect(-view, normal), normalize(vec3(0.25, 0.8, 0.55)));
    float wave = vModelPosition.z * 1.7 + normal.x * 2.6 + normal.y * 1.8;
    wave += sin(vModelPosition.y * 2.6) * 0.45;
    float silver = pow(0.5 + 0.5 * sin(wave * 2.5), 8.0);
    float fine = pow(0.5 + 0.5 * sin(wave * 8.0), 28.0);
    float light = clamp(pow(max(0.0, reflection), 3.0) * 0.8 * 0.1
        + (silver * 0.95 + fine * 0.5) * 0.2 + fresnel * 0.7 * 0.8, 0.0, 1.0);
    vec3 color = mix(vec3(0.012, 0.013, 0.028), vec3(0.35, 0.31, 0.78),
        clamp(light * 0.6 + fresnel * 0.18, 0.0, 1.0));
    color = mix(color, vec3(1.0), clamp(smoothstep(0.07, 0.95, light) * 2.65, 0.0, 1.0));

    // Screen-space coordinates need a background TOP with the same aspect
    // ratio and framing as the Render TOP.
    vec2 uv = (gl_FragCoord.xy - uTDGeneral.viewport.xy) * uTDGeneral.viewport.zw;
    // If the sampled background appears upside down, uncomment the next line:
    // uv.y = 1.0 - uv.y;
    vec3 incident = -view;
    float iorR = max(1.0, IOR - DISPERSION);
    float iorG = max(1.0, IOR);
    float iorB = max(1.0, IOR + DISPERSION);
    vec2 shiftR = (refract(incident, faceNormal, 1.0 / iorR).xy - incident.xy) * REFRACTION_AMOUNT;
    vec2 shiftG = (refract(incident, faceNormal, 1.0 / iorG).xy - incident.xy) * REFRACTION_AMOUNT;
    vec2 shiftB = (refract(incident, faceNormal, 1.0 / iorB).xy - incident.xy) * REFRACTION_AMOUNT;
    vec3 refracted = vec3(
        texture(uScene, clamp(uv + shiftR, 0.0, 1.0)).r,
        texture(uScene, clamp(uv + shiftG, 0.0, 1.0)).g,
        texture(uScene, clamp(uv + shiftB, 0.0, 1.0)).b
    );
    color = mix(color, refracted, clamp(REFRACTION_MIX, 0.0, 1.0));
    fragColor = TDOutputSwizzle(vec4(color, 1.0));
}

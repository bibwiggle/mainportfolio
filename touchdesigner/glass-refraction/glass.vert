// TouchDesigner GLSL MAT vertex shader (TouchDesigner 2025.30000+).
// TouchDesigner supplies the TD* functions and matrices below.

out vec3 vCameraNormal;
out vec3 vCameraView;
out vec3 vModelPosition;

void main()
{
    vec4 worldPosition = TDDeform(TDPos());
    vec3 worldNormal = TDDeformNorm(TDNormal());
    int cameraIndex = TDCameraIndex();
    vec4 cameraPosition = uTDMats[cameraIndex].cam * worldPosition;

    vCameraNormal = normalize(uTDMats[cameraIndex].camForNormals * worldNormal);
    vCameraView = -cameraPosition.xyz;
    vModelPosition = TDPos();
    gl_Position = TDWorldToProj(worldPosition);
}

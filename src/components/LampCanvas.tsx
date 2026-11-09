"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type LampCanvasProps = {
  variant?: "compact" | "lite" | "full";
  hero?: boolean;
  playing?: boolean;
  wireframe?: boolean;
  visible?: boolean;
  mobile?: boolean;
  rotation?: number;
  zoom?: number;
  anchorX?: number;
  offsetX?: number;
  scrollSpeed?: number;
  idleFps?: number;
  scrubLagMs?: number;
  bloomAmount?: number;
  bloomThreshold?: number;
  refraction?: {
    enabled: boolean;
    intermesh: boolean;
    ior: number;
    amount: number;
    dispersion: number;
    mix: number;
    quality: number;
    layerGap: number;
  };
  modelShader?: {
    emission: number;
    lightStrength: number;
    lightReach: number;
    lightDepth: number;
    lightHue: number;
    lightSaturation: number;
    reflectionStrength: number;
    highlightSharpness: number;
    bandStrength: number;
    fresnelStrength: number;
  };
  meshVisibility?: Record<string, boolean>;
  onVisualTopInset?: (pixels: number) => void;
};

const paths = {
  compact: "/models/pf-lamp-geometry-compact.glb",
  lite: "/models/pf-lamp-geometry-lite.glb",
  full: "/models/pf-lamp-geometry.glb",
};

const chromeVertexShader = `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPosition;
void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = -viewPosition.xyz;
  vPosition = position;
  gl_Position = projectionMatrix * viewPosition;
}`;

const chromeFragmentShader = `
precision highp float;
uniform float uBloomAmount;
uniform float uBloomThreshold;
uniform vec3 uLightStart;
uniform vec3 uLightEnd;
uniform vec3 uLightColor;
uniform float uLightStrength;
uniform float uLightReach;
uniform float uLightDepth;
uniform float uReflectionStrength;
uniform float uHighlightSharpness;
uniform float uBandStrength;
uniform float uFresnelStrength;
uniform sampler2D uRefractionTexture;
uniform vec2 uResolution;
uniform float uRefractionIor;
uniform float uRefractionAmount;
uniform float uRefractionDispersion;
uniform float uRefractionMix;
uniform sampler2D uPeelDepthTexture;
uniform vec2 uPeelResolution;
uniform float uPeelEnabled;
uniform float uPeelEpsilon;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPosition;
void main() {
  if (uPeelEnabled > 0.5) {
    float frontDepth = texture2D(uPeelDepthTexture, gl_FragCoord.xy / uPeelResolution).r;
    if (gl_FragCoord.z <= frontDepth + uPeelEpsilon) discard;
  }
  vec3 normal = normalize(vNormal);
  vec3 view = normalize(vView);
  float facing = abs(dot(normal, view));
  float fresnel = pow(1.0 - facing, 2.0);
  float reflection = dot(reflect(-view, normal), normalize(vec3(0.25, 0.8, 0.55)));
  float wave = vPosition.z * 1.7 + normal.x * 2.6 + normal.y * 1.8;
  wave += sin(vPosition.y * 2.6) * 0.45;
  float silver = pow(0.5 + 0.5 * sin(wave * 2.5), 8.0);
  float fine = pow(0.5 + 0.5 * sin(wave * 8.0), 28.0);
  vec3 lightStart = uLightStart + vec3(0.0, 0.0, uLightDepth);
  vec3 lightEnd = uLightEnd + vec3(0.0, 0.0, uLightDepth);
  vec3 axis = lightEnd - lightStart;
  vec3 surface = -vView;
  float along = clamp(dot(surface - lightStart, axis) / max(dot(axis, axis), 0.0001), 0.0, 1.0);
  vec3 towardLight = lightStart + axis * along - surface;
  float lightDistance = length(towardLight);
  vec3 lightDirection = towardLight / max(lightDistance, 0.0001);
  vec3 litNormal = gl_FrontFacing ? normal : -normal;
  float specular = pow(max(dot(reflect(-lightDirection, litNormal), view), 0.0), uHighlightSharpness);
  float falloff = 1.0 / (1.0 + pow(lightDistance / max(uLightReach, 0.01), 2.0));
  float diffuse = abs(dot(normal, lightDirection));
  float cylinderLight = (specular * 1.2 + diffuse * 0.25) * falloff * uLightStrength;
  float light = clamp(pow(max(0.0, reflection), 3.0) * 0.8 * uReflectionStrength +
    (silver * 0.95 + fine * 0.5) * uBandStrength + fresnel * 0.7 * uFresnelStrength +
    cylinderLight, 0.0, 1.0);
  vec3 dark = vec3(0.012, 0.013, 0.028);
  vec3 violet = vec3(0.35, 0.31, 0.78);
  vec3 color = mix(dark, violet, clamp(light * 0.6 + fresnel * 0.18, 0.0, 1.0));
  color = mix(color, vec3(1.0, 1.0, 1.0), clamp(smoothstep(uBloomThreshold, max(0.95, uBloomThreshold + 0.01), light) * uBloomAmount, 0.0, 1.0));
  color += uLightColor * cylinderLight * 0.35;
  if (uRefractionMix > 0.001) {
    // The first pass supplies the chrome scene. Bend its screen-space image
    // with separate IORs for red, green and blue, as in Heckel's FBO method.
    vec3 incident = -view;
    vec3 faceNormal = gl_FrontFacing ? normal : -normal;
    float iorR = max(1.0, uRefractionIor - uRefractionDispersion);
    float iorG = max(1.0, uRefractionIor);
    float iorB = max(1.0, uRefractionIor + uRefractionDispersion);
    vec2 shiftR = (refract(incident, faceNormal, 1.0 / iorR).xy - incident.xy) * uRefractionAmount;
    vec2 shiftG = (refract(incident, faceNormal, 1.0 / iorG).xy - incident.xy) * uRefractionAmount;
    vec2 shiftB = (refract(incident, faceNormal, 1.0 / iorB).xy - incident.xy) * uRefractionAmount;
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec4 sampleR = texture2D(uRefractionTexture, clamp(uv + shiftR, 0.0, 1.0));
    vec4 sampleG = texture2D(uRefractionTexture, clamp(uv + shiftG, 0.0, 1.0));
    vec4 sampleB = texture2D(uRefractionTexture, clamp(uv + shiftB, 0.0, 1.0));
    vec3 refracted = vec3(sampleR.r, sampleG.g, sampleB.b);
    float coverage = max(sampleR.a, max(sampleG.a, sampleB.a));
    color = mix(color, refracted, clamp(uRefractionMix * coverage, 0.0, 1.0));
  }
  gl_FragColor = vec4(color, 1.0);
}`;

const emitterVertexShader = `
varying float vAlong;
void main() {
  vAlong = position.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const emitterFragmentShader = `
precision highp float;
uniform vec3 uLightColor;
uniform float uEmission;
uniform float uEmitterMin;
uniform float uEmitterMax;
varying float vAlong;
void main() {
  float endFade = smoothstep(uEmitterMin, uEmitterMin + 1.0, vAlong) *
    (1.0 - smoothstep(uEmitterMax - 1.0, uEmitterMax, vAlong));
  gl_FragColor = vec4(uLightColor * uEmission, clamp(uEmission * endFade, 0.0, 1.0));
}`;

export function LampCanvas(props: LampCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !propsRef.current.mobile, powerPreference: "low-power" });
    } catch {
      container.textContent = "This device could not start the 3D preview.";
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, propsRef.current.mobile ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);
    const refractionTarget = propsRef.current.hero
      ? new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true, stencilBuffer: false })
      : null;
    if (refractionTarget) refractionTarget.depthTexture = new THREE.DepthTexture(1, 1);
    const behindTarget = propsRef.current.hero
      ? new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true, stencilBuffer: false })
      : null;
    const neutralTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    neutralTexture.needsUpdate = true;
    const drawingBufferSize = new THREE.Vector2();

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);
    const group = new THREE.Group();
    scene.add(group);

    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let controls: OrbitControls | null = null;
    let material: THREE.Material | null = null;
    let emitterMaterial: THREE.ShaderMaterial | null = null;
    let emitter: THREE.Mesh | null = null;
    let emitterParent: THREE.Object3D | null = null;
    let emitterMin = 0;
    let emitterMax = 0;
    let uniforms: Record<string, { value: number | THREE.Vector2 | THREE.Vector3 | THREE.Color | THREE.Texture }> | null = null;
    const emitterUniforms = {
      uLightColor: { value: new THREE.Color(0xffffff) },
      uEmission: { value: 1.4 },
      uEmitterMin: { value: 0 },
      uEmitterMax: { value: 0 },
    };
    const lightStart = new THREE.Vector3();
    const lightEnd = new THREE.Vector3();
    const lightColor = new THREE.Color();
    let disposed = false;
    let raf = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let targetFrames = 0;
    let displayedFrames = 0;
    let duration = 1;
    let angle = propsRef.current.hero ? propsRef.current.rotation ?? 90 : 0;
    let lastZoom = propsRef.current.zoom ?? 1.8;
    let fittedWidth = 1;
    let fittedHeight = 1;
    let modelCenterX = 0;
    let modelTop = 0;
    let lastAnchorX = propsRef.current.anchorX ?? 50;
    let lastOffsetX = propsRef.current.offsetX ?? 0;

    const placeModel = () => {
      if (!model || !propsRef.current.hero) return;
      const pixelsPerWorldUnit = container.clientHeight * camera.zoom / 2;
      const anchorShift = (50 - (propsRef.current.anchorX ?? 50)) * fittedWidth / 100;
      const pixelNudge = (propsRef.current.offsetX ?? 0) / Math.max(0.001, pixelsPerWorldUnit);
      group.position.x = -modelCenterX + anchorShift + pixelNudge;
    };

    const fit = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.zoom = Math.min(2 * aspect / (fittedWidth * 1.04), 2 / (fittedHeight * 1.04)) * (propsRef.current.hero ? propsRef.current.zoom ?? 1.8 : 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      placeModel();
      if (model && propsRef.current.hero) {
        const projectedTop = Math.min(1, modelTop * camera.zoom);
        propsRef.current.onVisualTopInset?.(Math.max(0, (1 - projectedTop) * height / 2));
      }
    };

    const getSculptureBounds = () => {
      // The source cylinder extends beyond the sculpture. Keep it in the scene,
      // but exclude it from the camera fit so the existing crop stays stable.
      if (emitter && emitterParent) emitterParent.remove(emitter);
      const box = new THREE.Box3().setFromObject(group);
      if (emitter && emitterParent) emitterParent.add(emitter);
      return box;
    };

    const refitModel = () => {
      if (!model) return;
      group.position.x = 0;
      group.rotation.z = THREE.MathUtils.degToRad(angle);
      const box = getSculptureBounds();
      const size = box.getSize(new THREE.Vector3());
      fittedWidth = Math.max(size.x, 0.01);
      fittedHeight = Math.max(size.y, 0.01);
      modelCenterX = box.getCenter(new THREE.Vector3()).x;
      modelTop = box.max.y;
      fit();
    };

    const onScroll = () => {
      const y = window.scrollY;
      targetFrames += (y - lastScrollY) * (propsRef.current.scrollSpeed ?? 0.39);
      lastScrollY = y;
    };

    const loader = new GLTFLoader();
    loader.load(paths[props.variant ?? "lite"], (gltf) => {
      if (disposed) {
        gltf.scene.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).geometry.dispose();
        });
        return;
      }
      model = gltf.scene;
      if (propsRef.current.hero) {
        const sourceCylinder = model.getObjectByName("Cylinder008");
        if (sourceCylinder && (sourceCylinder as THREE.Mesh).isMesh) {
          emitter = sourceCylinder as THREE.Mesh;
          emitterParent = emitter.parent;
          emitter.geometry.computeBoundingBox();
          emitterMin = emitter.geometry.boundingBox?.min.y ?? 0;
          emitterMax = emitter.geometry.boundingBox?.max.y ?? 0;
          emitterParent?.remove(emitter);
        }
      }
      const bounds = new THREE.Box3().setFromObject(model);
      model.position.sub(bounds.getCenter(new THREE.Vector3()));
      if (emitter && emitterParent) emitterParent.add(emitter);
      group.add(model);

      if (propsRef.current.hero) {
        uniforms = {
          uBloomAmount: { value: propsRef.current.bloomAmount ?? 1.2 },
          uBloomThreshold: { value: propsRef.current.bloomThreshold ?? 0.19 },
          uLightStart: { value: new THREE.Vector3() },
          uLightEnd: { value: new THREE.Vector3() },
          uLightColor: { value: lightColor },
          uLightStrength: { value: 1.2 },
          uLightReach: { value: 2.2 },
          uLightDepth: { value: 1 },
          uReflectionStrength: { value: 1 },
          uHighlightSharpness: { value: 24 },
          uBandStrength: { value: 1 },
          uFresnelStrength: { value: 1 },
          uRefractionTexture: { value: neutralTexture },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uRefractionIor: { value: 1.31 },
          uRefractionAmount: { value: 0.06 },
          uRefractionDispersion: { value: 0.04 },
          uRefractionMix: { value: 0 },
          uPeelDepthTexture: { value: neutralTexture },
          uPeelResolution: { value: new THREE.Vector2(1, 1) },
          uPeelEnabled: { value: 0 },
          uPeelEpsilon: { value: 0.0005 },
        };
        material = new THREE.ShaderMaterial({ vertexShader: chromeVertexShader, fragmentShader: chromeFragmentShader, uniforms, side: THREE.DoubleSide });
        if (emitter) {
          emitterUniforms.uEmitterMin.value = emitterMin;
          emitterUniforms.uEmitterMax.value = emitterMax;
          emitterMaterial = new THREE.ShaderMaterial({ vertexShader: emitterVertexShader, fragmentShader: emitterFragmentShader, uniforms: emitterUniforms, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
        }
      } else {
        material = new THREE.MeshStandardMaterial({ color: "#bcc2c9", metalness: 0.15, roughness: 0.44, side: THREE.DoubleSide });
        scene.add(new THREE.AmbientLight(0xffffff, 1.4));
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(-8, 12, 16);
        scene.add(light);
      }
      model.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).material = object === emitter && emitterMaterial ? emitterMaterial : material!;
      });

      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer!.clipAction(clip).play());
      duration = gltf.animations[0]?.duration || 1;
      refitModel();
      if (!propsRef.current.hero) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minZoom = camera.zoom * 0.4;
        controls.maxZoom = camera.zoom * 5;
      }
    }, undefined, () => {
      if (!disposed) container.insertAdjacentText("beforeend", "Could not load the 3D model.");
    });

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(container);
    if (propsRef.current.hero) window.addEventListener("scroll", onScroll, { passive: true });
    fit();

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const delta = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      if (!model || !mixer || propsRef.current.visible === false) return;

      const currentAngle = propsRef.current.hero ? propsRef.current.rotation ?? 90 : 0;
      if (currentAngle !== angle) {
        angle = currentAngle;
        refitModel();
      }
      if (propsRef.current.hero && (propsRef.current.zoom ?? 1.8) !== lastZoom) {
        lastZoom = propsRef.current.zoom ?? 1.8;
        fit();
      }
      if (propsRef.current.meshVisibility) {
        model.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) object.visible = propsRef.current.meshVisibility?.[object.name] ?? true;
        });
      }
      const nextAnchorX = propsRef.current.anchorX ?? 50;
      const nextOffsetX = propsRef.current.offsetX ?? 0;
      if (nextAnchorX !== lastAnchorX || nextOffsetX !== lastOffsetX) {
        lastAnchorX = nextAnchorX;
        lastOffsetX = nextOffsetX;
        placeModel();
      }

      if (propsRef.current.hero) {
        targetFrames += (propsRef.current.idleFps ?? 24) * delta;
        const lag = propsRef.current.scrubLagMs ?? 160;
        const alpha = lag <= 0 ? 1 : 1 - Math.exp(-delta * 1000 / lag);
        displayedFrames += (targetFrames - displayedFrames) * alpha;
        const time = ((displayedFrames / 24) % duration + duration) % duration;
        mixer.setTime(time);
        if (uniforms) {
          uniforms.uBloomAmount.value = propsRef.current.bloomAmount ?? 1.2;
          uniforms.uBloomThreshold.value = propsRef.current.bloomThreshold ?? 0.19;
          const shader = propsRef.current.modelShader;
          lightColor.setHSL((shader?.lightHue ?? 255) / 360, shader?.lightSaturation ?? 0.28, 0.7);
          uniforms.uLightStrength.value = (shader?.lightStrength ?? 1.2) * (shader?.emission ?? 1.4);
          uniforms.uLightReach.value = shader?.lightReach ?? 2.2;
          uniforms.uLightDepth.value = shader?.lightDepth ?? 1;
          uniforms.uReflectionStrength.value = shader?.reflectionStrength ?? 1;
          uniforms.uHighlightSharpness.value = shader?.highlightSharpness ?? 24;
          uniforms.uBandStrength.value = shader?.bandStrength ?? 1;
          uniforms.uFresnelStrength.value = shader?.fresnelStrength ?? 1;
          uniforms.uRefractionIor.value = propsRef.current.refraction?.ior ?? 1.31;
          uniforms.uRefractionAmount.value = propsRef.current.refraction?.amount ?? 0.06;
          uniforms.uRefractionDispersion.value = propsRef.current.refraction?.dispersion ?? 0.04;
          emitterUniforms.uEmission.value = shader?.emission ?? 1.4;
          emitterUniforms.uLightColor.value.copy(lightColor);
          if (emitter) {
            scene.updateMatrixWorld(true);
            camera.updateMatrixWorld(true);
            lightStart.set(0, emitterMin, 0);
            lightEnd.set(0, emitterMax, 0);
            emitter.localToWorld(lightStart);
            emitter.localToWorld(lightEnd);
            lightStart.applyMatrix4(camera.matrixWorldInverse);
            lightEnd.applyMatrix4(camera.matrixWorldInverse);
            (uniforms.uLightStart.value as THREE.Vector3).copy(lightStart);
            (uniforms.uLightEnd.value as THREE.Vector3).copy(lightEnd);
          }
        }
      } else if (propsRef.current.playing !== false) {
        mixer.update(delta);
      }
      if (material && "wireframe" in material) (material as THREE.MeshStandardMaterial).wireframe = !!propsRef.current.wireframe;
      controls?.update();
      const refraction = propsRef.current.refraction;
      if (refractionTarget && uniforms && refraction?.enabled && refraction.mix > 0 && refraction.amount > 0) {
        renderer.getDrawingBufferSize(drawingBufferSize);
        const quality = THREE.MathUtils.clamp(refraction.quality, 0.25, 1);
        const targetWidth = Math.max(1, Math.round(drawingBufferSize.x * quality));
        const targetHeight = Math.max(1, Math.round(drawingBufferSize.y * quality));
        if (refractionTarget.width !== targetWidth || refractionTarget.height !== targetHeight) {
          refractionTarget.setSize(targetWidth, targetHeight);
          behindTarget?.setSize(targetWidth, targetHeight);
        }
        (uniforms.uResolution.value as THREE.Vector2).copy(drawingBufferSize);
        uniforms.uRefractionMix.value = 0;
        uniforms.uPeelEnabled.value = 0;
        // Keep both samplers off the target being written, even when their
        // shader branches are disabled; WebGL forbids texture feedback loops.
        uniforms.uRefractionTexture.value = neutralTexture;
        uniforms.uPeelDepthTexture.value = neutralTexture;
        renderer.setRenderTarget(refractionTarget);
        renderer.render(scene, camera);
        if (refraction.intermesh && behindTarget) {
          const emitterVisible = emitter?.visible;
          if (emitter) emitter.visible = false;
          (uniforms.uPeelResolution.value as THREE.Vector2).set(targetWidth, targetHeight);
          uniforms.uPeelEpsilon.value = refraction.layerGap;
          uniforms.uPeelDepthTexture.value = refractionTarget.depthTexture!;
          uniforms.uPeelEnabled.value = 1;
          renderer.setRenderTarget(behindTarget);
          renderer.render(scene, camera);
          uniforms.uPeelEnabled.value = 0;
          if (emitter) emitter.visible = emitterVisible ?? true;
          uniforms.uRefractionTexture.value = behindTarget.texture;
        } else {
          uniforms.uRefractionTexture.value = refractionTarget.texture;
        }
        renderer.setRenderTarget(null);
        uniforms.uRefractionMix.value = refraction.mix;
      } else if (uniforms) {
        uniforms.uRefractionMix.value = 0;
        uniforms.uPeelEnabled.value = 0;
      }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      controls?.dispose();
      mixer?.stopAllAction();
      model?.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).geometry.dispose();
      });
      material?.dispose();
      emitterMaterial?.dispose();
      refractionTarget?.depthTexture?.dispose();
      refractionTarget?.dispose();
      behindTarget?.dispose();
      neutralTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [props.variant, props.hero, props.mobile]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}

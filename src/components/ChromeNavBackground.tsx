"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export const DEFAULT_CHROME_SETTINGS = {
  CHROME_REFLECTION: 0.9,
  CHROME_SCALE: 1.65,
  CHROME_SPEED: 0.45,
  CHROME_DISTORTION: 0.55,
  CHROME_SHARPNESS: 3,
  CHROME_DARKNESS: 0.7,
  CHROME_PIXEL_SIZE: 8,
  CHROME_PIXEL_AMOUNT: 1,
  CHROME_NOISE_AMOUNT: 1.9,
  CHROME_NOISE_HARMONICS: 2,
  CHROME_NOISE_PERIOD: 1.3,
  CHROME_NOISE_ROUGHNESS: 0.55,
  CHROME_NOISE_LACUNARITY: 1.85,
  CHROME_NOISE_SPEED: 0.95,
  CHROME_NOISE_SEED: 8,
};

export type ChromeNavSettings = typeof DEFAULT_CHROME_SETTINGS;

// Preserve the pattern scale from the approved desktop layout as the viewport changes.
const REFERENCE_WIDTH = 1707;
const REFERENCE_HEIGHT = 56;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_reflection;
  uniform float u_scale;
  uniform float u_distortion;
  uniform float u_sharpness;
  uniform vec2 u_css_resolution;
  uniform float u_pixel_size;
  uniform float u_pixel_amount;
  uniform float u_noise_amount;
  uniform float u_noise_harmonics;
  uniform float u_noise_period;
  uniform float u_noise_roughness;
  uniform float u_noise_lacunarity;
  uniform float u_noise_time;
  uniform float u_noise_seed;
  uniform float u_noise_footprint;
  uniform float u_pixel_noise_footprint;
  const vec2 referenceSize = vec2(${REFERENCE_WIDTH.toFixed(1)}, ${REFERENCE_HEIGHT.toFixed(1)});
  const vec2 patternSpan = vec2(8.0, 1.2);

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    // Quintic interpolation keeps the surface's slope smooth at cell boundaries.
    vec2 blend = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
      blend.y
    );
  }

  float fractalNoise(vec2 p, float footprint) {
    float sum = 0.0;
    float weight = 1.0;
    float totalWeight = 0.0;
    float frequency = 1.0;
    for (int harmonic = 0; harmonic < 6; harmonic++) {
      if (float(harmonic) >= u_noise_harmonics || weight < 0.001) break;
      // Fade detail that is finer than a pixel instead of producing shimmer.
      float detail = 1.0 - smoothstep(0.15, 0.5, frequency * footprint);
      if (detail < 0.001) break;
      sum += valueNoise(p) * weight * detail;
      totalWeight += weight * detail;
      p = mat2(0.8, -0.6, 0.6, 0.8) * p * u_noise_lacunarity + vec2(7.3, 11.8);
      weight *= u_noise_roughness;
      frequency *= u_noise_lacunarity;
    }
    // Normalize so adding harmonics changes detail without increasing strength.
    return sum / max(totalWeight, 0.0001) * 2.0 - 1.0;
  }

  float surface(vec2 p, float footprint) {
    float waves = sin(p.x * 0.9 + u_time * 0.22) * 0.22
      + sin(p.x * 1.8 - p.y * 2.0 - u_time * 0.18) * 0.12
      + sin(p.x * 0.4 + p.y * 5.2 + u_time * 0.12) * 0.08;
    if (u_noise_amount <= 0.0) return waves;
    vec2 noisePosition = p / u_noise_period
      + vec2(u_noise_seed * 0.37, u_noise_seed * 0.61)
      + vec2(u_noise_time * 0.23, -u_noise_time * 0.17);
    return waves + fractalNoise(noisePosition, footprint) * u_noise_amount * 0.35;
  }

  vec3 shade(vec2 uv, float footprint) {
    // Crop around the center instead of squeezing the whole pattern into the header.
    vec2 p = ((uv - 0.5) * u_css_resolution * patternSpan / referenceSize + patternSpan * 0.5) / u_scale;
    float h = surface(p, footprint);
    vec2 slope = vec2(surface(p + vec2(0.02, 0.0), footprint) - h,
                      surface(p + vec2(0.0, 0.02), footprint) - h) / 0.02;
    vec3 normal = normalize(vec3(-slope * u_distortion, 1.0));
    vec3 reflection = reflect(vec3(0.0, 0.0, -1.0), normal);

    // Narrow bright reflections and broad graphite bands suggest polished metal.
    float bands = 0.5 + 0.5 * sin(reflection.y * 8.0 + reflection.x * 2.2);
    float glint = pow(bands, u_sharpness);
    float softReflection = pow(bands, 3.0);
    float edge = pow(abs(uv.y * 2.0 - 1.0), 10.0);
    vec3 silver = vec3(0.90, 0.94, 1.0);
    vec3 color = silver * (0.055 + u_reflection * (softReflection * 0.22 + glint * 0.56 + edge * 0.13));
    return color;
  }

  void main() {
    if (u_pixel_amount <= 0.0) {
      gl_FragColor = vec4(shade(v_uv, u_noise_footprint), 1.0);
      return;
    }
    // Keep the pixel grid aligned to the same virtual canvas while cropping its sides.
    vec2 screenUv = vec2(v_uv.x, 1.0 - v_uv.y);
    vec2 cropOffset = vec2((referenceSize.x - u_css_resolution.x) * 0.5, 0.0);
    vec2 cell = floor((screenUv * u_css_resolution + cropOffset) / u_pixel_size);
    vec2 sampleUv = clamp(((cell + 0.5) * u_pixel_size - cropOffset) / u_css_resolution, 0.0, 1.0);
    sampleUv.y = 1.0 - sampleUv.y;
    vec3 pixelColor = shade(sampleUv, u_pixel_noise_footprint);
    if (u_pixel_amount >= 1.0) {
      gl_FragColor = vec4(pixelColor, 1.0);
      return;
    }
    gl_FragColor = vec4(mix(shade(v_uv, u_noise_footprint), pixelColor, u_pixel_amount), 1.0);
  }
`;

export function ChromeNavBackground({ active, settings = DEFAULT_CHROME_SETTINGS }: { active: boolean; settings?: ChromeNavSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const settingsRef = useRef(settings);
  const resumeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    settingsRef.current = settings;
    resumeRef.current?.();
  }, [active, settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!gl) return; // The CSS chrome finish remains when WebGL is unavailable.

    const shaders: WebGLShader[] = [];
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };

    try {
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Unable to create chrome shader");
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(shader) || "Unable to compile chrome shader");
        }
        return shader;
      };

      program = gl.createProgram();
      if (!program) throw new Error("Unable to create chrome program");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Unable to link chrome shader");
      }
      gl.useProgram(program);
      buffer = gl.createBuffer();
      if (!buffer) throw new Error("Unable to create chrome geometry");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    } catch (error) {
      console.warn("Using the static chrome navigation background.", error);
      dispose();
      return;
    }

    const time = gl.getUniformLocation(program, "u_time");
    const reflection = gl.getUniformLocation(program, "u_reflection");
    const scale = gl.getUniformLocation(program, "u_scale");
    const distortion = gl.getUniformLocation(program, "u_distortion");
    const sharpness = gl.getUniformLocation(program, "u_sharpness");
    const cssResolution = gl.getUniformLocation(program, "u_css_resolution");
    const pixelSize = gl.getUniformLocation(program, "u_pixel_size");
    const pixelAmount = gl.getUniformLocation(program, "u_pixel_amount");
    const noiseAmount = gl.getUniformLocation(program, "u_noise_amount");
    const noiseHarmonics = gl.getUniformLocation(program, "u_noise_harmonics");
    const noisePeriod = gl.getUniformLocation(program, "u_noise_period");
    const noiseRoughness = gl.getUniformLocation(program, "u_noise_roughness");
    const noiseLacunarity = gl.getUniformLocation(program, "u_noise_lacunarity");
    const noiseTimeUniform = gl.getUniformLocation(program, "u_noise_time");
    const noiseSeed = gl.getUniformLocation(program, "u_noise_seed");
    const noiseFootprint = gl.getUniformLocation(program, "u_noise_footprint");
    const pixelNoiseFootprint = gl.getUniformLocation(program, "u_pixel_noise_footprint");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let lastPaint = -Infinity;
    let contextLost = false;
    let animationTime = 0;
    let noiseTime = 0;
    let lastTime: number | null = null;

    const draw = (now: number) => {
      const current = settingsRef.current;
      // Integrate speed so changing the control doesn't jump to a different phase.
      if (lastTime !== null && !reducedMotion.matches) {
        const elapsed = Math.min(now - lastTime, 100) / 1000 * current.CHROME_SPEED;
        animationTime += elapsed;
        noiseTime += elapsed * current.CHROME_NOISE_SPEED;
      }
      lastTime = now;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssWidth = Math.max(1, canvas.clientWidth);
      const cssHeight = Math.max(1, canvas.clientHeight);
      const width = Math.max(1, Math.round(cssWidth * dpr));
      const height = Math.max(1, Math.round(cssHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform1f(time, reducedMotion.matches ? 0 : animationTime);
      gl.uniform1f(reflection, current.CHROME_REFLECTION);
      gl.uniform1f(scale, current.CHROME_SCALE);
      gl.uniform1f(distortion, current.CHROME_DISTORTION);
      gl.uniform1f(sharpness, current.CHROME_SHARPNESS);
      gl.uniform2f(cssResolution, cssWidth, cssHeight);
      gl.uniform1f(pixelSize, current.CHROME_PIXEL_SIZE);
      gl.uniform1f(pixelAmount, current.CHROME_PIXEL_AMOUNT);
      gl.uniform1f(noiseAmount, current.CHROME_NOISE_AMOUNT);
      gl.uniform1f(noiseHarmonics, current.CHROME_NOISE_HARMONICS);
      gl.uniform1f(noisePeriod, current.CHROME_NOISE_PERIOD);
      gl.uniform1f(noiseRoughness, current.CHROME_NOISE_ROUGHNESS);
      gl.uniform1f(noiseLacunarity, current.CHROME_NOISE_LACUNARITY);
      gl.uniform1f(noiseTimeUniform, reducedMotion.matches ? 0 : noiseTime);
      gl.uniform1f(noiseSeed, current.CHROME_NOISE_SEED);
      const noiseScale = current.CHROME_SCALE * current.CHROME_NOISE_PERIOD;
      gl.uniform1f(noiseFootprint, Math.max(8 / REFERENCE_WIDTH * cssWidth / width, 1.2 / REFERENCE_HEIGHT * cssHeight / height) / noiseScale);
      gl.uniform1f(pixelNoiseFootprint, Math.max(8 / REFERENCE_WIDTH, 1.2 / REFERENCE_HEIGHT) * current.CHROME_PIXEL_SIZE / noiseScale);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.style.opacity = "1";
      lastPaint = now;
    };

    const tick = (now: number) => {
      frame = null;
      if (!activeRef.current || document.hidden || contextLost) return;
      if (now - lastPaint >= 1000 / 30) draw(now);
      if (!reducedMotion.matches && settingsRef.current.CHROME_SPEED > 0) {
        frame = requestAnimationFrame(tick);
      }
    };

    const resume = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
      if (!activeRef.current || document.hidden || contextLost) return;
      draw(performance.now());
      if (!reducedMotion.matches && settingsRef.current.CHROME_SPEED > 0) {
        frame = requestAnimationFrame(tick);
      }
    };

    const onContextLost = () => {
      contextLost = true;
      canvas.style.opacity = "0";
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    resumeRef.current = resume;
    const observer = new ResizeObserver(resume);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", resume);
    reducedMotion.addEventListener("change", resume);
    canvas.addEventListener("webglcontextlost", onContextLost);
    resume();

    return () => {
      resumeRef.current = null;
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      reducedMotion.removeEventListener("change", resume);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.style.opacity = "0";
      dispose();
    };
  }, []);

  return (
    <div className="chrome-nav-surface" aria-hidden="true" style={{
      "--chrome-darkness": settings.CHROME_DARKNESS,
      "--chrome-edge-darkness": settings.CHROME_DARKNESS * (0.12 / 0.58),
    } as CSSProperties}>
      <canvas ref={canvasRef} className="h-full w-full opacity-0" />
    </div>
  );
}

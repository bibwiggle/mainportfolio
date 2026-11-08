"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export const DEFAULT_CHROME_SETTINGS = {
  CHROME_REFLECTION: 0.5,
  CHROME_SCALE: 1.7,
  CHROME_SPEED: 0.8,
  CHROME_DISTORTION: 0.25,
  CHROME_SHARPNESS: 15,
  CHROME_DARKNESS: 0.23,
  CHROME_NOISE_AMOUNT: 1.9,
  CHROME_NOISE_HARMONICS: 2,
  CHROME_NOISE_PERIOD: 1.3,
  CHROME_NOISE_ROUGHNESS: 0.55,
  CHROME_NOISE_LACUNARITY: 1.85,
  CHROME_NOISE_SPEED: 0.95,
  CHROME_NOISE_SEED: 8,
};

export type ChromeNavSettings = typeof DEFAULT_CHROME_SETTINGS;

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
  uniform float u_noise_amount;
  uniform float u_noise_harmonics;
  uniform float u_noise_period;
  uniform float u_noise_roughness;
  uniform float u_noise_lacunarity;
  uniform float u_noise_time;
  uniform float u_noise_seed;
  uniform float u_noise_footprint;

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

  float fractalNoise(vec2 p) {
    float sum = 0.0;
    float weight = 1.0;
    float totalWeight = 0.0;
    float frequency = 1.0;
    for (int harmonic = 0; harmonic < 6; harmonic++) {
      if (float(harmonic) >= u_noise_harmonics || weight < 0.001) break;
      // Fade detail that is finer than a pixel instead of producing shimmer.
      float detail = 1.0 - smoothstep(0.15, 0.5, frequency * u_noise_footprint);
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

  float surface(vec2 p) {
    float waves = sin(p.x * 0.9 + u_time * 0.22) * 0.22
      + sin(p.x * 1.8 - p.y * 2.0 - u_time * 0.18) * 0.12
      + sin(p.x * 0.4 + p.y * 5.2 + u_time * 0.12) * 0.08;
    if (u_noise_amount <= 0.0) return waves;
    vec2 noisePosition = p / u_noise_period
      + vec2(u_noise_seed * 0.37, u_noise_seed * 0.61)
      + vec2(u_noise_time * 0.23, -u_noise_time * 0.17);
    return waves + fractalNoise(noisePosition) * u_noise_amount * 0.35;
  }

  void main() {
    vec2 p = v_uv * vec2(8.0, 1.2) / u_scale;
    float h = surface(p);
    vec2 slope = vec2(surface(p + vec2(0.02, 0.0)) - h,
                      surface(p + vec2(0.0, 0.02)) - h) / 0.02;
    vec3 normal = normalize(vec3(-slope * u_distortion, 1.0));
    vec3 reflection = reflect(vec3(0.0, 0.0, -1.0), normal);

    // Narrow bright reflections and broad graphite bands suggest polished metal.
    float bands = 0.5 + 0.5 * sin(reflection.y * 8.0 + reflection.x * 2.2);
    float glint = pow(bands, u_sharpness);
    float softReflection = pow(bands, 3.0);
    float edge = pow(abs(v_uv.y * 2.0 - 1.0), 10.0);
    vec3 silver = vec3(0.90, 0.94, 1.0);
    vec3 color = silver * (0.055 + u_reflection * (softReflection * 0.22 + glint * 0.56 + edge * 0.13));
    gl_FragColor = vec4(color, 1.0);
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
    const noiseAmount = gl.getUniformLocation(program, "u_noise_amount");
    const noiseHarmonics = gl.getUniformLocation(program, "u_noise_harmonics");
    const noisePeriod = gl.getUniformLocation(program, "u_noise_period");
    const noiseRoughness = gl.getUniformLocation(program, "u_noise_roughness");
    const noiseLacunarity = gl.getUniformLocation(program, "u_noise_lacunarity");
    const noiseTimeUniform = gl.getUniformLocation(program, "u_noise_time");
    const noiseSeed = gl.getUniformLocation(program, "u_noise_seed");
    const noiseFootprint = gl.getUniformLocation(program, "u_noise_footprint");
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
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
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
      gl.uniform1f(noiseAmount, current.CHROME_NOISE_AMOUNT);
      gl.uniform1f(noiseHarmonics, current.CHROME_NOISE_HARMONICS);
      gl.uniform1f(noisePeriod, current.CHROME_NOISE_PERIOD);
      gl.uniform1f(noiseRoughness, current.CHROME_NOISE_ROUGHNESS);
      gl.uniform1f(noiseLacunarity, current.CHROME_NOISE_LACUNARITY);
      gl.uniform1f(noiseTimeUniform, reducedMotion.matches ? 0 : noiseTime);
      gl.uniform1f(noiseSeed, current.CHROME_NOISE_SEED);
      gl.uniform1f(noiseFootprint, Math.max(8 / width, 1.2 / height) / (current.CHROME_SCALE * current.CHROME_NOISE_PERIOD));
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

import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';

// --- GLSL Shaders ---
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_cloud_density;
  uniform float u_glow_intensity;
  uniform float u_cloud_speed;

  float random(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898,78.233,151.7182))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0 - 2.0*f);

    return mix(
      mix(mix(random(i+vec3(0,0,0)), random(i+vec3(1,0,0)), u.x),
          mix(random(i+vec3(0,1,0)), random(i+vec3(1,1,0)), u.x), u.y),
      mix(mix(random(i+vec3(0,0,1)), random(i+vec3(1,0,1)), u.x),
          mix(random(i+vec3(0,1,1)), random(i+vec3(1,1,1)), u.x), u.y),
      u.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 6; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // Treat the local vertex position as our 3D coordinate for noise
    vec3 pos = normalize(vPosition);

    // Apply procedural cloud / nebula drift using the cloud speed scalar
    vec3 coord = pos * u_cloud_density + vec3(u_time * u_cloud_speed * 0.8, u_time * u_cloud_speed, u_time * u_cloud_speed * 0.4);
    float c = fbm(coord);
    vec3 nebula = mix(u_color1, u_color2, smoothstep(0.4, 0.6, c));

    // Fresnel rim glow
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0)
                    * u_glow_intensity;
    // Boost glow intensity slightly and clamp it
    vec3 glow = fresnel * u_color2 * 1.5;

    gl_FragColor = vec4(nebula + glow, 1.0);
  }
`;

export interface ShaderCanvasProps {
  color1?: THREE.Color | string | number;
  color2?: THREE.Color | string | number;
  cloudDensity?: number;
  glowIntensity?: number;
  rotationSpeed?: number;
  cloudSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = memo(({
  color1 = 0xff4444,
  color2 = 0x4444ff,
  cloudDensity = 2.0,
  glowIntensity = 1.0,
  rotationSpeed = 0.5,
  cloudSpeed = 0.1,
  className = "",
  style = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.OrthographicCamera;
    uniforms?: {
      u_time: { value: number };
      u_color1: { value: THREE.Color };
      u_color2: { value: THREE.Color };
      u_cloud_density: { value: number };
      u_glow_intensity: { value: number };
      u_cloud_speed: { value: number };
    };
    sphere?: THREE.Mesh;
    clock?: THREE.Clock;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    // Orthographic strictly controls the shape to stay a perfect circle without perspective warp (egg shape)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2.0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0.0 },
      u_color1: { value: new THREE.Color(color1) },
      u_color2: { value: new THREE.Color(color2) },
      u_cloud_density: { value: cloudDensity },
      u_glow_intensity: { value: glowIntensity },
      u_cloud_speed: { value: cloudSpeed },
    };

    // Use a PERFECT sphere geometry. Radius ~1 matches camera frustum (-1 to 1 bounds).
    const geo = new THREE.SphereGeometry(0.98, 64, 64);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.FrontSide, // KEY FIX: Only draw front half! Stops the "back bleeding through" hollow look perfectly.
    });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    const clock = new THREE.Clock();
    threeRef.current = { renderer, scene, camera, uniforms, sphere, clock };

    function onResize() {
      if (!container) return;
      const W = container.clientWidth;
      const H = container.clientHeight;

      const aspect = W / H;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      renderer.setSize(W, H);
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    onResize();

    let raf: number;
    const loop = () => {
      const { clock, sphere } = threeRef.current;
      const delta = clock!.getDelta();
      sphere!.rotation.y += delta * rotationSpeed;
      uniforms.u_time.value = clock!.getElapsedTime();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color1, color2, cloudDensity, glowIntensity, rotationSpeed, cloudSpeed]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={style}
    />
  );
});

export default ShaderCanvas;

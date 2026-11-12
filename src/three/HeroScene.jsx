import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Loads a texture without suspending, so a slow/blocked image never breaks the scene.
function useSafeTexture(url) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (alive) setTex(t);
        else t.dispose();
      },
      undefined,
      () => {}
    );
    return () => {
      alive = false;
    };
  }, [url]);
  useEffect(() => () => tex?.dispose(), [tex]);
  return tex;
}

function PhotoCard({ url, angle, radius, y, tint }) {
  const tex = useSafeTexture(url);
  const mat = useRef();
  useFrame((_, dt) => {
    if (mat.current) mat.current.opacity = THREE.MathUtils.damp(mat.current.opacity, tex ? 1 : 0.35, 3, dt);
  });
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
      <mesh position={[x, y, z]} rotation={[0, angle, 0]}>
        <planeGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          ref={mat}
          map={tex}
          color={tex ? "#ffffff" : tint}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function Rig({ children }) {
  const group = useRef();
  useFrame((state, dt) => {
    const g = group.current;
    g.rotation.y += dt * 0.08;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.15, 2, dt);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.8, 2, dt);
    state.camera.lookAt(0, 0, 0);
  });
  return <group ref={group}>{children}</group>;
}

function Blob() {
  return (
    <Float speed={2} floatIntensity={1.2}>
      <mesh scale={1.15}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#ff6a3d"
          emissive="#3b0a52"
          roughness={0.15}
          metalness={0.6}
          distort={0.45}
          speed={2.2}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene({ images = [] }) {
  const cards = useMemo(() => {
    const list = images.slice(0, 8);
    return list.map((url, i) => ({
      url,
      angle: (i / list.length) * Math.PI * 2,
      radius: 3.6,
      y: (i % 2 ? 0.5 : -0.5) + Math.sin(i) * 0.3,
      tint: ["#2a2a35", "#3a2430", "#1f2f3a"][i % 3],
    }));
  }, [images]);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffd8c2" />
      <pointLight position={[-4, -2, -3]} intensity={30} color="#7c4dff" />
      <Rig>
        <Blob />
        {cards.map((c, i) => (
          <PhotoCard key={i} {...c} />
        ))}
      </Rig>
      <Sparkles count={120} scale={[12, 6, 10]} size={2.2} speed={0.35} color="#ffb48a" opacity={0.7} />
    </Canvas>
  );
}

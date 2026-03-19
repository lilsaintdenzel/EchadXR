import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Text } from '@react-three/drei'
import * as THREE from 'three'

// ─── Utilities ────────────────────────────────────────────────────────────────

function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Layered sine noise — terrain height at world (x, z)
function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.28 + 0.5)          * 0.9 +
    Math.sin(z * 0.22 + 1.1)          * 0.8 +
    Math.sin((x + z) * 0.14)          * 1.3 +
    Math.sin(x * 0.55 - z * 0.38)     * 0.5 +
    Math.sin(x * 0.08 + z * 0.06)     * 2.0
  )
}

// ─── Terrain ──────────────────────────────────────────────────────────────────

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(150, 150, 110, 110)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, terrainHeight(pos.getX(i), pos.getY(i)))
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color="#1b190d" roughness={0.97} metalness={0.03} />
    </mesh>
  )
}

// ─── Olive Tree ───────────────────────────────────────────────────────────────

function OliveTree({ position = [0, 0, 0], seed = 1 }) {
  const groupRef = useRef()

  const trunkGeo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 14; i++) {
      const t = i / 14
      const twist = seed * 4.1 + t * Math.PI * 2.8
      pts.push(
        new THREE.Vector3(
          Math.sin(twist) * 0.28 * (1 - t * 0.65),
          t * 3.0,
          Math.cos(twist) * 0.28 * (1 - t * 0.65)
        )
      )
    }
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts),
      28, 0.13, 7, false
    )
  }, [seed])

  const foliage = useMemo(() => {
    const rng = makeRng(seed * 613)
    const count = 5 + Math.floor(rng() * 4)
    const clusters = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rng() * 0.6
      const r = 0.55 + rng() * 0.65
      clusters.push({
        x: Math.sin(angle) * r,
        y: 2.1 + rng() * 1.1,
        z: Math.cos(angle) * r,
        sx: 0.75 + rng() * 0.45,
        sy: 0.55 + rng() * 0.35,
        sz: 0.75 + rng() * 0.45,
        dark: i % 2 === 0,
      })
    }
    clusters.push({ x: 0, y: 3.0, z: 0, sx: 1.0, sy: 0.75, sz: 1.0, dark: false })
    return clusters
  }, [seed])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.28 + seed) * 0.025
    groupRef.current.rotation.x = Math.sin(t * 0.19 + seed * 1.7) * 0.018
  })

  return (
    <group position={position} ref={groupRef}>
      <mesh geometry={trunkGeo} castShadow>
        <meshStandardMaterial color="#2c1e13" roughness={1} />
      </mesh>
      {foliage.map((f, i) => (
        <mesh
          key={i}
          position={[f.x, f.y, f.z]}
          scale={[f.sx, f.sy, f.sz]}
          castShadow
        >
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial
            color={f.dark ? '#152b15' : '#1c3a1c'}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Rock ─────────────────────────────────────────────────────────────────────

function Rock({ position, scale, seed }) {
  const rng = makeRng(seed * 500)
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[rng() * Math.PI, rng() * Math.PI, rng() * Math.PI]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#28231e" roughness={0.92} metalness={0.08} />
    </mesh>
  )
}

// ─── Moon + God Rays ──────────────────────────────────────────────────────────

const MOON = [18, 22, -35]

function Moon() {
  const rays = [
    { r: 4,  h: 20, op: 0.045 },
    { r: 8,  h: 32, op: 0.026 },
    { r: 14, h: 46, op: 0.014 },
  ]

  return (
    <group>
      {/* Moon sphere */}
      <mesh position={MOON}>
        <sphereGeometry args={[2.2, 28, 18]} />
        <meshStandardMaterial
          color="#ede3b4"
          emissive="#c8a850"
          emissiveIntensity={0.65}
          roughness={1}
        />
      </mesh>

      {/* Moonlight */}
      <pointLight
        position={MOON}
        intensity={1.2}
        distance={120}
        color="#b8c8e0"
        castShadow
      />

      {/* Volumetric god rays — tip at moon, base expanding downward */}
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[MOON[0], MOON[1] - ray.h / 2, MOON[2]]}
        >
          <coneGeometry args={[ray.r, ray.h, 18, 1, true]} />
          <meshBasicMaterial
            color="#d4c078"
            transparent
            opacity={ray.op}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Praying Figure (Jesus) ───────────────────────────────────────────────────

function PrayingFigure() {
  const y = terrainHeight(0, -1) + 0.05
  return (
    <group position={[0, y, -1]}>
      {/* Body — hunched forward in anguish */}
      <mesh position={[0, 0.58, 0.22]} rotation={[0.95, 0, 0]}>
        <capsuleGeometry args={[0.19, 0.52, 4, 8]} />
        <meshStandardMaterial color="#0d0b07" roughness={1} />
      </mesh>

      {/* Head bowed to ground */}
      <mesh position={[0, 0.98, 0.58]}>
        <sphereGeometry args={[0.17, 8, 6]} />
        <meshStandardMaterial color="#0d0b07" roughness={1} />
      </mesh>

      {/* Arms stretched forward to earth */}
      <mesh position={[0.26, 0.62, 0.72]} rotation={[1.55, 0, 0.18]}>
        <capsuleGeometry args={[0.055, 0.38, 3, 6]} />
        <meshStandardMaterial color="#0d0b07" roughness={1} />
      </mesh>
      <mesh position={[-0.26, 0.62, 0.72]} rotation={[1.55, 0, -0.18]}>
        <capsuleGeometry args={[0.055, 0.38, 3, 6]} />
        <meshStandardMaterial color="#0d0b07" roughness={1} />
      </mesh>

      {/* Subtle holy glow */}
      <pointLight position={[0, 1.2, 0]} intensity={0.5} distance={5} color="#f0d060" />

      {/* Ground glow beneath him — additive plane */}
      <mesh position={[0, 0.02, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 24]} />
        <meshBasicMaterial
          color="#c89020"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ─── Sleeping Disciple ────────────────────────────────────────────────────────

function SleepingDisciple({ position, angle = 0 }) {
  const [x, , z] = position
  const y = terrainHeight(x, z) + 0.08
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, angle]}>
        <capsuleGeometry args={[0.18, 0.52, 4, 8]} />
        <meshStandardMaterial color="#0b0a07" roughness={1} />
      </mesh>
      <mesh position={[Math.sin(angle) * 0.38, 0.04, Math.cos(angle) * -0.38]}>
        <sphereGeometry args={[0.15, 6, 5]} />
        <meshStandardMaterial color="#0b0a07" roughness={1} />
      </mesh>
    </group>
  )
}

// ─── Firefly Particles ────────────────────────────────────────────────────────

function Fireflies({ count = 40 }) {
  const mesh = useRef()

  const { positions, phases } = useMemo(() => {
    const rng = makeRng(9999)
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (rng() - 0.5) * 20
      pos[i * 3 + 1] = 0.3 + rng() * 2.5
      pos[i * 3 + 2] = (rng() - 0.5) * 20 - 4
      ph[i] = rng() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return g
  }, [positions])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      pos.setY(i, positions[i * 3 + 1] + Math.sin(t * 0.8 + phases[i]) * 0.3)
      pos.setX(i, positions[i * 3] + Math.sin(t * 0.4 + phases[i] * 1.3) * 0.15)
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geo}>
      <pointsMaterial
        color="#c8e060"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Gethsemane ───────────────────────────────────────────────────────────────

const TREES = [
  { position: [-4.0, 0, -6.0], seed: 1 },
  { position: [ 3.5, 0, -5.0], seed: 2 },
  { position: [-2.0, 0, -8.5], seed: 3 },
  { position: [ 5.5, 0, -9.0], seed: 4 },
  { position: [-6.5, 0, -4.0], seed: 5 },
  { position: [ 7.5, 0, -7.5], seed: 6 },
  { position: [-8.5, 0,-11.0], seed: 7 },
  { position: [ 2.0, 0,-13.0], seed: 8 },
  { position: [ 0.5, 0, -4.5], seed: 9 },
  { position: [-5.0, 0, -2.0], seed: 10 },
].map(t => ({
  ...t,
  position: [
    t.position[0],
    terrainHeight(t.position[0], t.position[2]),
    t.position[2],
  ],
}))

const ROCKS = [
  { position: [ 1.5,  0, -2.0], scale: [0.40, 0.30, 0.35], seed: 20 },
  { position: [-1.5,  0, -3.5], scale: [0.30, 0.22, 0.28], seed: 21 },
  { position: [ 4.0,  0, -4.5], scale: [0.55, 0.42, 0.48], seed: 22 },
  { position: [-5.0,  0, -7.5], scale: [0.65, 0.50, 0.58], seed: 23 },
  { position: [ 0.5,  0,  2.0], scale: [0.38, 0.28, 0.32], seed: 24 },
  { position: [-2.5,  0,  1.0], scale: [0.28, 0.20, 0.26], seed: 25 },
  { position: [ 6.0,  0, -2.0], scale: [0.45, 0.35, 0.40], seed: 26 },
].map(r => ({
  ...r,
  position: [
    r.position[0],
    terrainHeight(r.position[0], r.position[2]) + r.scale[1] * 0.4,
    r.position[2],
  ],
}))

export default function Gethsemane() {
  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={['#04060e', 20, 70]} />
      <ambientLight intensity={0.08} color="#1a2030" />

      {/* Stars */}
      <Stars
        radius={90}
        depth={60}
        count={5000}
        factor={3}
        saturation={0.15}
        fade
        speed={0.4}
      />

      {/* Terrain */}
      <Terrain />

      {/* Moon + rays */}
      <Moon />

      {/* Olive trees */}
      {TREES.map((t, i) => (
        <OliveTree key={i} position={t.position} seed={t.seed} />
      ))}

      {/* Rocks */}
      {ROCKS.map((r, i) => (
        <Rock key={i} position={r.position} scale={r.scale} seed={r.seed} />
      ))}

      {/* Narrative — Jesus praying */}
      <PrayingFigure />

      {/* Narrative — sleeping disciples */}
      <SleepingDisciple position={[-3.5, 0,  1.8]} angle={0.4} />
      <SleepingDisciple position={[-4.8, 0,  0.6]} angle={-0.3} />
      <SleepingDisciple position={[ 3.2, 0,  2.2]} angle={2.1} />

      {/* Fireflies */}
      <Fireflies count={40} />

      {/* Scripture */}
      <Text
        position={[0, 4.5, -7]}
        fontSize={0.28}
        color="#c8a040"
        anchorX="center"
        maxWidth={7}
        textAlign="center"
        outlineWidth={0.005}
        outlineColor="#000000"
      >
        {'"Not my will, but yours be done."\nLuke 22:42'}
      </Text>
    </>
  )
}

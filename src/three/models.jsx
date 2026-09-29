// Peças de hardware modeladas em código (sem arquivos .glb).
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { usePalette } from './palette.js'

/* ---------- materiais ---------- */
function Mat({ c = 'body', rough = 0.45, metal = 0.35 }) {
  const p = usePalette()
  return <meshStandardMaterial color={p[c]} roughness={rough} metalness={metal} />
}
function Glow({ c = 'accent', k = 1 }) {
  const p = usePalette()
  return <meshStandardMaterial color={p[c]} emissive={p[c]} emissiveIntensity={p.glow * k} toneMapped={false} />
}
const Metal = () => <Mat c="metal" rough={0.28} metal={0.9} />
const Gold = () => <Mat c="gold" rough={0.3} metal={1} />

function Box({ args, position, rotation, children }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      {children}
    </mesh>
  )
}

/* ---------- Teclado ---------- */
const PITCH = 0.27
const ACCENT_KEYS = new Set(['0-0', '1-2', '2-1', '2-2', '2-3', '2-14', '0-14'])

export function Keyboard() {
  const keys = useMemo(() => {
    const list = []
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 15; c++) {
        if (r === 4 && c > 3 && c < 11) continue // espaço do "space"
        list.push({ id: `${r}-${c}`, x: -1.89 + c * PITCH, z: -0.54 + r * PITCH })
      }
    }
    return list
  }, [])
  const normal = keys.filter((k) => !ACCENT_KEYS.has(k.id))
  const accent = keys.filter((k) => ACCENT_KEYS.has(k.id))

  // animação de "digitação": teclas aleatórias afundam
  const refs = useRef([])
  const press = useRef(new Float32Array(normal.length))
  const timer = useRef(0)
  useFrame((_, dt) => {
    timer.current += dt
    if (timer.current > 0.11) {
      timer.current = 0
      press.current[Math.floor(Math.random() * normal.length)] = 1
    }
    for (let i = 0; i < normal.length; i++) {
      const v = press.current[i]
      if (v <= 0) continue
      press.current[i] = Math.max(0, v - dt * 6)
      const o = refs.current[i]
      if (o) o.position.y = 0.2 - Math.sin(press.current[i] * Math.PI) * 0.06
    }
  })

  return (
    <group>
      <RoundedBox args={[4.4, 0.26, 1.62]} radius={0.08} smoothness={3}>
        <Mat c="body" />
      </RoundedBox>
      <Box args={[4.2, 0.035, 0.035]} position={[0, -0.06, 0.82]}><Glow /></Box>
      <Instances limit={normal.length}>
        <boxGeometry args={[0.22, 0.12, 0.22]} />
        <Mat c="key" rough={0.6} metal={0.1} />
        {normal.map((k, i) => (
          <Instance key={k.id} ref={(el) => (refs.current[i] = el)} position={[k.x, 0.2, k.z]} />
        ))}
      </Instances>
      {accent.map((k) => (
        <Box key={k.id} args={[0.22, 0.12, 0.22]} position={[k.x, 0.2, k.z]}><Glow k={0.6} /></Box>
      ))}
      {/* barra de espaço */}
      <Box args={[1.84, 0.12, 0.22]} position={[0, 0.2, 0.54]}><Mat c="key" rough={0.6} metal={0.1} /></Box>
    </group>
  )
}

/* ---------- Mouse ---------- */
export function Mouse() {
  const wheel = useRef()
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.05, -0.86),
      new THREE.Vector3(0, -0.1, -1.3),
      new THREE.Vector3(0.35, -0.16, -1.7),
      new THREE.Vector3(0.05, -0.2, -2.2),
      new THREE.Vector3(0.45, -0.22, -2.7),
    ])
    return new THREE.TubeGeometry(curve, 48, 0.035, 8, false)
  }, [])
  useEffect(() => () => cable.dispose(), [cable])
  useFrame((_, dt) => { if (wheel.current) wheel.current.rotation.x -= dt * 4 })

  return (
    <group>
      <mesh scale={[0.56, 0.3, 0.9]}>
        <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat c="body" rough={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[0.56, 0.9, 1]}>
        <circleGeometry args={[1, 48]} />
        <Mat c="body2" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.565, 0.905, 1]} position={[0, 0.01, 0]}>
        <torusGeometry args={[1, 0.022, 10, 80]} />
        <Glow />
      </mesh>
      <Box args={[0.014, 0.03, 0.6]} position={[0, 0.265, -0.5]} rotation={[-0.35, 0, 0]}><Mat c="slot" /></Box>
      <mesh ref={wheel} position={[0, 0.27, -0.36]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 0.08, 20]} />
        <Glow k={0.8} />
      </mesh>
      <mesh geometry={cable}><Mat c="body2" rough={0.6} /></mesh>
    </group>
  )
}

/* ---------- Placa-mãe ---------- */
const TRACES = [
  [-0.9, 0.2, 1.2, 0], [-0.9, -0.4, 0, 0.9], [0.3, -1.2, 0.8, 0], [0.9, 0.3, 0, 1.0], [-1.2, 1.4, 1.6, 0],
  [-1.3, -1.4, 0, 0.9], [0.2, 0.9, 0, 0.6], [-0.4, 1.1, 1.0, 0], [1.25, -1.3, 0, 1.4], [-0.6, -0.9, 0.7, 0],
]

export function Motherboard() {
  const caps = useMemo(() => {
    const a = []
    for (let i = 0; i < 6; i++) a.push([-0.75 + i * 0.22, -0.15])
    for (let i = 0; i < 5; i++) a.push([-0.95, -1.15 + i * 0.22])
    return a
  }, [])
  return (
    <group>
      <RoundedBox args={[3.1, 0.08, 3.5]} radius={0.03} smoothness={2}>
        <Mat c="pcb" rough={0.55} metal={0.2} />
      </RoundedBox>
      {/* trilhas */}
      {TRACES.map(([x, z, w, d], i) => (
        <Box key={i} args={[w || 0.025, 0.01, d || 0.025]} position={[x + (w ? w / 2 : 0), 0.045, z + (d ? d / 2 : 0)]}>
          <Glow c={i % 2 ? 'accent' : 'accent2'} k={0.7} />
        </Box>
      ))}
      {/* soquete + CPU */}
      <Box args={[0.95, 0.08, 0.95]} position={[-0.3, 0.08, -0.75]}><Mat c="slot" /></Box>
      <RoundedBox args={[0.72, 0.1, 0.72]} radius={0.03} smoothness={2} position={[-0.3, 0.16, -0.75]}>
        <Metal />
      </RoundedBox>
      <Box args={[0.3, 0.012, 0.3]} position={[-0.3, 0.216, -0.75]}><Glow k={0.5} /></Box>
      {/* slots de RAM + pentes */}
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} args={[0.07, 0.1, 1.7]} position={[0.55 + i * 0.16, 0.09, -0.65]}><Mat c="slot" /></Box>
      ))}
      {[0, 2].map((i) => (
        <group key={i} position={[0.55 + i * 0.16, 0.36, -0.65]}>
          <Box args={[0.05, 0.46, 1.6]}><Mat c="body2" /></Box>
          <Box args={[0.06, 0.05, 1.6]} position={[0, 0.25, 0]}><Glow /></Box>
        </group>
      ))}
      {/* PCIe */}
      <Box args={[2.2, 0.1, 0.1]} position={[0.2, 0.09, 0.75]}><Mat c="slot" /></Box>
      <Box args={[2.2, 0.1, 0.1]} position={[0.2, 0.09, 1.25]}><Mat c="slot" /></Box>
      {/* chipset */}
      <RoundedBox args={[0.55, 0.12, 0.55]} radius={0.03} smoothness={2} position={[0.95, 0.1, 0.95]} rotation={[0, Math.PI / 4, 0]}>
        <Metal />
      </RoundedBox>
      {/* capacitores */}
      {caps.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.13, z]}>
          <cylinderGeometry args={[0.055, 0.055, 0.18, 14]} />
          <Metal />
        </mesh>
      ))}
      {/* painel traseiro I/O */}
      <Box args={[0.35, 0.42, 1.2]} position={[-1.35, 0.25, -0.95]}><Metal /></Box>
      <Box args={[0.36, 0.05, 0.9]} position={[-1.35, 0.3, -0.95]}><Glow c="accent2" k={0.6} /></Box>
    </group>
  )
}

/* ---------- Placa de vídeo ---------- */
function Fan({ x }) {
  const blades = useRef()
  useFrame((_, dt) => { if (blades.current) blades.current.rotation.z -= dt * 7 })
  return (
    <group position={[x, 0, 0.26]}>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.55, 40]} />
        <Mat c="slot" rough={0.8} metal={0} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.56, 0.045, 12, 48]} />
        <Glow k={0.9} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} rotation={[0, 0, (i / 9) * Math.PI * 2]}>
            <mesh position={[0.27, 0, 0.02]} rotation={[0.45, 0, 0]}>
              <boxGeometry args={[0.44, 0.13, 0.015]} />
              <Mat c="body2" rough={0.4} />
            </mesh>
          </group>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
          <Metal />
        </mesh>
      </group>
    </group>
  )
}

export function GPU() {
  return (
    <group>
      <RoundedBox args={[3.5, 1.35, 0.46]} radius={0.1} smoothness={3}>
        <Mat c="body" rough={0.4} />
      </RoundedBox>
      <Fan x={-0.85} />
      <Fan x={0.85} />
      {/* backplate */}
      <Box args={[3.45, 1.3, 0.05]} position={[0, 0, -0.26]}><Metal /></Box>
      {/* faixa RGB */}
      <Box args={[3.0, 0.045, 0.1]} position={[0, 0.68, 0.05]}><Glow /></Box>
      <Box args={[0.08, 1.0, 0.04]} position={[1.72, 0, 0.2]}><Glow c="accent2" /></Box>
      {/* suporte + conectores */}
      <Box args={[0.05, 1.55, 0.55]} position={[-1.78, -0.05, 0]}><Metal /></Box>
      <Box args={[1.5, 0.12, 0.05]} position={[0.2, -0.72, -0.25]}><Gold /></Box>
      <Box args={[0.4, 0.14, 0.2]} position={[1.1, 0.72, -0.1]}><Mat c="slot" /></Box>
    </group>
  )
}

/* ---------- Monitor com código sendo digitado ---------- */
const CODE = `const dev = {
  nome: "Renan Jussiani",
  cargo: "Full-stack",
  stack: ["React", "Node", "SQL"],
  cafe: true,
};

function contratar(dev) {
  // spoiler: a resposta é sim
  return dev.cafe ? "sim!" : "claro!";
}

contratar(dev); // "sim!"`

const TOKEN_RE = /(\/\/.*$)|("[^"]*"?)|\b(const|function|return|true|false)\b|(\d+)|([A-Za-z_]\w*)(?=\()|([A-Za-z_]\w*)|(\s+)|(.)/g

function drawEditor(ctx, W, H, ed, shown, caretOn) {
  ctx.fillStyle = ed.bg
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = ed.bar
  ctx.fillRect(0, 0, W, 54)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath(); ctx.arc(30 + i * 28, 27, 9, 0, Math.PI * 2); ctx.fill()
  })
  ctx.font = '600 22px "JetBrains Mono", monospace'
  ctx.fillStyle = ed.text
  ctx.fillText('renan.js', 128, 35)
  ctx.fillStyle = ed.caret
  ctx.fillRect(118, 50, 112, 4)

  const lines = CODE.slice(0, shown).split('\n')
  ctx.font = '25px "JetBrains Mono", monospace'
  const lh = 36, top = 92, left = 76
  let caretX = left, caretY = top
  lines.forEach((line, n) => {
    const y = top + n * lh
    ctx.fillStyle = ed.gutter
    ctx.textAlign = 'right'
    ctx.fillText(String(n + 1), 46, y)
    ctx.textAlign = 'left'
    let x = left
    line.replace(TOKEN_RE, (m, com, str, kw, num, fn, id) => {
      ctx.fillStyle = com ? ed.com : str ? ed.str : kw ? ed.kw : num ? ed.num : fn ? ed.fn : id ? ed.text : ed.punct
      ctx.fillText(m, x, y)
      x += ctx.measureText(m).width
      return m
    })
    caretX = x; caretY = y
  })
  if (caretOn) {
    ctx.fillStyle = ed.caret
    ctx.fillRect(caretX + 2, caretY - 24, 12, 30)
  }
}

function useCodeTexture() {
  const p = usePalette()
  const state = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 614
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return { canvas, ctx: canvas.getContext('2d'), tex, shown: 0, acc: 0, hold: 0, caret: true, dirty: true }
  }, [])

  useEffect(() => { state.dirty = true }, [p, state])
  useEffect(() => {
    document.fonts?.ready.then(() => { state.dirty = true })
    return () => state.tex.dispose()
  }, [state])

  useFrame((clock, dt) => {
    state.acc += dt
    if (state.hold > 0) {
      state.hold -= dt
      if (state.hold <= 0) state.shown = 0
    } else if (state.acc > 0.045) {
      state.acc = 0
      state.shown += 1
      state.dirty = true
      if (state.shown >= CODE.length) state.hold = 3.5
    }
    const caret = Math.floor(clock.clock.elapsedTime * 2) % 2 === 0
    if (caret !== state.caret) { state.caret = caret; state.dirty = true }
    if (state.dirty) {
      drawEditor(state.ctx, 1024, 614, p.editor, state.shown, state.caret)
      state.tex.needsUpdate = true
      state.dirty = false
    }
  })
  return state.tex
}

export function Monitor() {
  const tex = useCodeTexture()
  return (
    <group>
      <RoundedBox args={[4.3, 2.72, 0.14]} radius={0.07} smoothness={3}>
        <Mat c="body" rough={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.04, 0.072]}>
        <planeGeometry args={[4.1, 2.46]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <Box args={[1.2, 0.03, 0.02]} position={[0, -1.33, 0.072]}><Glow /></Box>
      {/* traseira, haste e base */}
      <RoundedBox args={[2.2, 1.4, 0.3]} radius={0.1} smoothness={2} position={[0, 0, -0.2]}>
        <Mat c="body2" />
      </RoundedBox>
      <Box args={[0.28, 1.2, 0.12]} position={[0, -1.55, -0.3]}><Metal /></Box>
      <RoundedBox args={[1.7, 0.08, 0.9]} radius={0.04} smoothness={2} position={[0, -2.15, -0.2]}>
        <Metal />
      </RoundedBox>
    </group>
  )
}

/* ---------- Memória RAM ---------- */
export function RAM() {
  return (
    <group>
      <Box args={[3.1, 0.8, 0.05]}><Mat c="pcb" /></Box>
      <RoundedBox args={[3.05, 0.66, 0.16]} radius={0.03} smoothness={2} position={[0, 0.05, 0]}>
        <Mat c="body2" rough={0.35} metal={0.6} />
      </RoundedBox>
      {[-1, 0, 1].map((i) => (
        <Box key={i} args={[0.7, 0.04, 0.17]} position={[i * 0.9, 0.05, 0.001]}><Mat c="body" /></Box>
      ))}
      <Box args={[3.0, 0.1, 0.17]} position={[0, 0.43, 0]}><Glow /></Box>
      <Box args={[1.35, 0.1, 0.055]} position={[-0.78, -0.41, 0]}><Gold /></Box>
      <Box args={[1.35, 0.1, 0.055]} position={[0.8, -0.41, 0]}><Gold /></Box>
    </group>
  )
}

/* ---------- Processador ---------- */
function useCpuLabel() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    ctx.fillStyle = 'rgba(20,30,50,0.85)'
    ctx.textAlign = 'center'
    ctx.font = '700 34px "Space Grotesk", sans-serif'
    ctx.fillText('RJ CORE', 128, 116)
    ctx.font = '500 22px "JetBrains Mono", monospace'
    ctx.fillText('i∞ · 2026', 128, 152)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

export function CPU() {
  const label = useCpuLabel()
  return (
    <group>
      <Box args={[1.5, 0.07, 1.5]}><Mat c="pcb" /></Box>
      <RoundedBox args={[1.12, 0.12, 1.12]} radius={0.04} smoothness={2} position={[0, 0.09, 0]}>
        <Mat c="metal" rough={0.22} metal={1} />
      </RoundedBox>
      <mesh position={[0, 0.152, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
      <mesh position={[-0.62, 0.045, 0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 3]} />
        <Gold />
      </mesh>
      <Box args={[1.52, 0.02, 1.52]} position={[0, -0.045, 0]}><Glow k={0.5} /></Box>
    </group>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles } from '@react-three/drei'
import { PALETTES, PaletteContext } from './palette.js'
import { CPU, GPU, Keyboard, Monitor, Motherboard, Mouse, RAM } from './models.jsx'

const CAM_Z = 12
const FOV = 45
const HALF_TAN = Math.tan((FOV / 2) * (Math.PI / 180))
const TAU = Math.PI * 2
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PIECES = [
  // expand: em vez de girar, o monitor cresce em direção à tela
  { id: 'monitor', label: 'Monitor', Model: Monitor, expand: true },
  { id: 'gpu', label: 'Placa de vídeo', Model: GPU },
  { id: 'ram', label: 'Memória RAM', Model: RAM },
  { id: 'mouse', label: 'Mouse', Model: Mouse },
  { id: 'motherboard', label: 'Placa-mãe', Model: Motherboard },
  { id: 'keyboard', label: 'Teclado', Model: Keyboard },
  { id: 'cpu', label: 'Processador', Model: CPU },
]

// x/y normalizados (-1..1 da tela na profundidade z), s = escala, r = rotação base
const HOME_WIDE = {
  monitor: { x: 0.42, y: 0.14, z: 0, s: 1, r: [0, -0.3, 0] },
  keyboard: { x: 0.4, y: -0.66, z: 2, s: 0.85, r: [0.75, -0.25, 0] },
  mouse: { x: 0.8, y: -0.62, z: 2.5, s: 0.8, r: [0.7, -0.6, 0] },
  gpu: { x: 0.86, y: 0.5, z: -3, s: 0.95, r: [0.2, -0.7, 0.15] },
  motherboard: { x: 0.12, y: 0.72, z: -5, s: 1.1, r: [1.0, 0.4, 0.2] },
  ram: { x: 0.94, y: -0.1, z: -1, s: 0.8, r: [0, -0.5, 1.3] },
  cpu: { x: 0.06, y: -0.5, z: 1, s: 0.75, r: [0.9, 0.5, 0] },
}
const HOME_TALL = {
  monitor: { x: 0, y: 0.5, z: 0, s: 1, r: [0, -0.2, 0] },
  keyboard: { x: -0.05, y: 0.17, z: 2, s: 0.9, r: [0.8, -0.2, 0] },
  mouse: { x: 0.72, y: 0.13, z: 2.5, s: 0.85, r: [0.7, -0.6, 0] },
  gpu: { x: -0.72, y: 0.86, z: -4, s: 0.9, r: [0.2, 0.6, 0.2] },
  motherboard: { x: 0.75, y: 0.9, z: -6, s: 1, r: [1, 0.4, 0.2] },
  ram: { x: 0.92, y: 0.48, z: -2, s: 0.8, r: [0, -0.5, 1.3] },
  cpu: { x: -0.82, y: 0.3, z: 1, s: 0.7, r: [0.9, 0.5, 0] },
}
// Nas outras abas as peças vão para as bordas; cada aba gira a ordem
const RING = [
  [-0.86, 0.72, -4], [0.86, 0.7, -4], [0.95, 0.02, -3], [0.84, -0.76, -2.5],
  [0, -1.04, -6], [-0.84, -0.76, -2.5], [-0.95, 0.02, -3],
]
const RING_OFFSET = { sobre: 0, projetos: 2, contato: 4 }

function getLayout(tab, tall) {
  const home = tall ? HOME_TALL : HOME_WIDE
  if (tab === 'inicio') return home
  const out = {}
  PIECES.forEach((p, i) => {
    const [x, y, z] = RING[(i + RING_OFFSET[tab]) % RING.length]
    out[p.id] = { x, y, z, s: 0.62, r: home[p.id].r }
  })
  return out
}

const isBlocked = (e) => !!e.nativeEvent?.target?.closest?.('[data-solid]')

function Piece({ id, label, Model, expand, layout, kick, tip }) {
  const outer = useRef()
  const inner = useRef()
  const s = useRef({ spin: 0, target: 0, hover: 0, pop: 0, phase: Math.random() * TAU, placed: false })
  const [hovered, setHovered] = useState(false)
  const leaveTimer = useRef()

  // cada giro termina numa volta completa, com a peça de frente
  useEffect(() => {
    if (kick && !expand) s.current.target = Math.round(s.current.target / TAU) * TAU + TAU
  }, [kick, expand])
  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  useFrame((state, dt) => {
    const L = layout.current[id]
    const o = outer.current
    const st = s.current
    if (!o || !L) return
    dt = Math.min(dt, 0.05)
    const aspect = state.size.width / state.size.height
    const halfH = HALF_TAN * (CAM_Z - L.z)
    const fit = Math.min(1, Math.max(0.48, aspect / 1.45))
    const tx = L.x * halfH * aspect
    const ty = L.y * halfH
    const k = st.placed ? 1 - Math.exp(-dt * 2.6) : 1
    st.placed = true

    st.hover += ((hovered ? 1 : 0) - st.hover) * (1 - Math.exp(-dt * (expand ? 4 : 8)))
    // monitor ampliado: vem para frente e fica de frente para a câmera
    const grow = expand ? st.hover : 0
    const face = 1 - grow

    o.position.x += (tx - o.position.x) * k
    o.position.y += (ty - o.position.y) * k
    o.position.z += (L.z + grow * 3 - o.position.z) * k
    o.rotation.x += (L.r[0] * face - o.rotation.x) * k
    o.rotation.y += (L.r[1] * face - o.rotation.y) * k
    o.rotation.z += (L.r[2] * face - o.rotation.z) * k

    st.pop *= Math.exp(-dt * 5)
    const sc = L.s * fit * (expand ? 1 + grow * 0.45 : 1 + st.hover * 0.08 + st.pop * 0.12)
    o.scale.setScalar(o.scale.x + (sc - o.scale.x) * (st.placed ? 1 - Math.exp(-dt * 5) : 1))

    // giro suave até o alvo + flutuação
    if (hovered && !expand) st.target += dt * 1.4
    st.spin += (st.target - st.spin) * (1 - Math.exp(-dt * 2.2))
    const t = state.clock.elapsedTime
    const i = inner.current
    if (REDUCED) {
      i.rotation.y = st.spin
    } else {
      i.position.y = Math.sin(t * 0.9 + st.phase) * 0.14 * face
      i.rotation.y = st.spin + Math.sin(t * 0.35 + st.phase) * 0.25 * face
      i.rotation.x = Math.sin(t * 0.5 + st.phase) * 0.06 * face
    }
  })

  // Passar de uma parte da peça para outra dispara "out" + "over" seguidos;
  // o atraso evita tratar isso como saída.
  const over = (e) => {
    if (isBlocked(e)) return
    e.stopPropagation()
    clearTimeout(leaveTimer.current)
    if (!hovered) setHovered(true)
    tip.show(label, e.nativeEvent)
  }
  const out = () => {
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => {
      setHovered(false)
      s.current.target = Math.round(s.current.target / TAU) * TAU // volta de frente pelo caminho mais curto
      tip.hide()
    }, 120)
  }
  const click = (e) => {
    if (isBlocked(e)) return
    e.stopPropagation()
    if (!expand) {
      s.current.target = Math.round(s.current.target / TAU) * TAU + TAU
      s.current.pop = 1
    }
    tip.show(label, e.nativeEvent)
    if (e.pointerType !== 'mouse') {
      // no toque não existe "tirar o mouse": o monitor volta sozinho
      clearTimeout(leaveTimer.current)
      leaveTimer.current = setTimeout(() => { setHovered(false); tip.hide() }, expand ? 2200 : 1400)
    }
  }

  return (
    <group ref={outer}>
      <group ref={inner} onPointerOver={over} onPointerOut={out} onPointerMove={(e) => hovered && tip.move(e.nativeEvent)} onClick={click}>
        <Model />
      </group>
    </group>
  )
}

function Rig() {
  const { camera } = useThree()
  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 2)
    const t = state.clock.elapsedTime
    const tx = state.pointer.x * 0.7 + (REDUCED ? 0 : Math.sin(t * 0.15) * 0.3)
    const ty = state.pointer.y * 0.45
    camera.position.x += (tx - camera.position.x) * k
    camera.position.y += (ty - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Lights({ p }) {
  const a = useRef()
  const b = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.4
    if (a.current) a.current.position.set(Math.cos(t) * 8, 3, Math.sin(t) * 4 + 4)
    if (b.current) b.current.position.set(Math.cos(t + Math.PI) * 8, -3, Math.sin(t + Math.PI) * 4 + 4)
  })
  return (
    <>
      <ambientLight intensity={p === PALETTES.dark ? 0.35 : 0.9} />
      <directionalLight position={[5, 8, 6]} intensity={p === PALETTES.dark ? 1.3 : 1.6} />
      <pointLight ref={a} color={p.accent} intensity={40} distance={20} />
      <pointLight ref={b} color={p.accent2} intensity={40} distance={20} />
    </>
  )
}

function Grid({ color }) {
  const ref = useRef()
  useEffect(() => {
    const m = ref.current?.material
    if (m) { m.transparent = true; m.opacity = 0.22; m.depthWrite = false }
  }, [color])
  return <gridHelper key={color} ref={ref} args={[90, 60, color, color]} position={[0, -7.5, -10]} />
}

function useTip() {
  const el = useRef(null)
  return useMemo(() => ({
    el,
    show(text, ev) {
      const d = el.current
      if (!d) return
      d.textContent = text
      d.classList.add('show')
      document.body.classList.add('is-grab')
      this.move(ev)
    },
    move(ev) {
      const d = el.current
      if (!d || !ev) return
      const x = Math.min(ev.clientX + 14, window.innerWidth - d.offsetWidth - 8)
      const y = Math.min(ev.clientY + 14, window.innerHeight - d.offsetHeight - 8)
      d.style.transform = `translate(${x}px, ${y}px)`
    },
    hide() {
      el.current?.classList.remove('show')
      document.body.classList.remove('is-grab')
    },
  }), [])
}

export default function Scene({ tab, theme, onReady }) {
  const p = PALETTES[theme] || PALETTES.dark
  const [tall, setTall] = useState(() => window.innerWidth / window.innerHeight < 0.85)
  const layout = useRef(getLayout(tab, tall))
  const [kick, setKick] = useState(0)
  const tip = useTip()
  const prevTab = useRef(tab)

  useEffect(() => {
    const onResize = () => setTall(window.innerWidth / window.innerHeight < 0.85)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    layout.current = getLayout(tab, tall)
    if (prevTab.current !== tab) {
      prevTab.current = tab
      setKick((k) => k + 1)
    }
  }, [tab, tall])

  useEffect(() => tip.hide, [tab, tip])

  return (
    <>
      <div className="scene" aria-hidden="true">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, CAM_Z], fov: FOV, near: 0.1, far: 120 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          eventSource={document.getElementById('root')}
          eventPrefix="client"
          onCreated={() => onReady?.()}
        >
          <PaletteContext.Provider value={p}>
            <Lights p={p} />
            <Environment resolution={128}>
              <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              <Lightformer intensity={1.5} color={p.accent} position={[-6, 1, 3]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
              <Lightformer intensity={1.5} color={p.accent2} position={[6, -1, 3]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
            </Environment>
            {PIECES.map((piece) => (
              <Piece key={piece.id} {...piece} layout={layout} kick={kick} tip={tip} />
            ))}
            {theme === 'dark' && <Sparkles count={tall ? 50 : 90} scale={[26, 16, 12]} position={[0, 0, -3]} size={3} speed={0.35} opacity={0.8} color={p.sparkle} />}
            <Grid color={p.grid} />
            <Rig />
          </PaletteContext.Provider>
        </Canvas>
      </div>
      <div ref={tip.el} className="tip mono" role="presentation" />
    </>
  )
}

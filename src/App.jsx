import { lazy, Suspense, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Home from './sections/Home.jsx'
import About from './sections/About.jsx'
import Projects from './sections/Projects.jsx'
import Contact from './sections/Contact.jsx'

const Scene = lazy(() => import('./three/Scene.jsx'))

const TABS = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'sobre', label: 'Sobre', icon: 'user' },
  { id: 'projetos', label: 'Projetos', icon: 'folder' },
  { id: 'contato', label: 'Contato', icon: 'mail' },
]

const readTab = () => {
  const h = window.location.hash.slice(1)
  return TABS.some((t) => t.id === h) ? h : 'inicio'
}

function useHashTab() {
  const [tab, setTab] = useState(readTab)
  useEffect(() => {
    const onHash = () => {
      setTab(readTab())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return tab
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#03060d' : '#f5faff')
    try { localStorage.setItem('theme', theme) } catch { /* sem storage */ }
  }, [theme])
  return [theme, setTheme]
}

export default function App() {
  const tab = useHashTab()
  const [theme, setTheme] = useTheme()
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2600) // garantia caso o 3D demore
    return () => clearTimeout(t)
  }, [])

  const titles = { inicio: 'Portfólio', sobre: 'Sobre', projetos: 'Projetos', contato: 'Contato' }
  useEffect(() => {
    document.title = `Renan Jussiani · ${titles[tab]}`
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={`boot ${booted ? 'is-done' : ''}`} aria-hidden="true">
        <div className="boot-box">
          <p>POST check<span>........</span>OK</p>
          <p>GPU · CPU · RAM<span>..</span>OK</p>
          <p>Carregando portfólio<span className="boot-dots" /></p>
          <div className="boot-bar"><i /></div>
        </div>
      </div>

      <div className="bg-deco" aria-hidden="true" />
      <Suspense fallback={null}>
        <Scene tab={tab} theme={theme} onReady={() => setTimeout(() => setBooted(true), 500)} />
      </Suspense>

      <Header tabs={TABS} tab={tab} theme={theme} setTheme={setTheme} />

      <main className="main">
        <div key={tab} className={`panel panel-${tab}`}>
          {tab === 'inicio' && <Home />}
          {tab === 'sobre' && <About />}
          {tab === 'projetos' && <Projects />}
          {tab === 'contato' && <Contact />}
        </div>
      </main>
    </>
  )
}

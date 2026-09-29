import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import ThemeSwitch from './ThemeSwitch.jsx'
import { contacts } from '../data.js'

// Mede a aba ativa para a "pílula" deslizar até ela
function useIndicator(tab) {
  const list = useRef(null)
  const [box, setBox] = useState(null)

  const measure = useCallback(() => {
    const el = list.current?.querySelector(`[data-tab="${tab}"]`)
    if (!el || !el.offsetWidth) return
    setBox({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })
  }, [tab])

  useLayoutEffect(measure, [measure])
  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const style = box
    ? { width: box.width, height: box.height, transform: `translate(${box.left}px, ${box.top}px)`, opacity: 1 }
    : { opacity: 0 }
  return [list, style]
}

export default function Header({ tabs, tab, theme, setTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [topList, topPill] = useIndicator(tab)
  const [bottomList, bottomPill] = useIndicator(tab)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`} data-solid>
        <a href="#inicio" className="brand" aria-label="Renan Jussiani — início">
          <span className="brand-mark mono">
            RJ<span className="brand-caret" />
          </span>
          <span className="brand-text">
            <strong>Renan Jussiani</strong>
            <small className="mono">full-stack dev</small>
          </span>
        </a>

        <nav className="nav-top" aria-label="Seções">
          <div className="nav-track" ref={topList}>
            <span className="nav-pill" style={topPill} aria-hidden="true" />
            {tabs.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                data-tab={t.id}
                className={tab === t.id ? 'active' : ''}
                aria-current={tab === t.id ? 'page' : undefined}
              >
                <Icon name={t.icon} size={16} />
                <span>{t.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="header-actions">
          <a href={contacts.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub" title="GitHub">
            <Icon name="github" size={18} />
          </a>
          <span className="header-divider" aria-hidden="true" />
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Barra de abas inferior no celular */}
      <nav className="nav-bottom" aria-label="Seções" data-solid>
        <div className="nav-bottom-track" ref={bottomList}>
          <span className="nav-pill" style={bottomPill} aria-hidden="true" />
          {tabs.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              data-tab={t.id}
              className={tab === t.id ? 'active' : ''}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <Icon name={t.icon} size={20} />
              <span>{t.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}

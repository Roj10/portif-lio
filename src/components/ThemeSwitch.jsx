import { useRef } from 'react'
import Icon from './Icons.jsx'

// Arrastar/clicar para a DIREITA = escuro; para a ESQUERDA = claro.
export default function ThemeSwitch({ theme, setTheme }) {
  const start = useRef(null)
  const dark = theme === 'dark'

  const onPointerDown = (e) => {
    start.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (start.current == null) return
    const dx = e.clientX - start.current
    start.current = null
    if (dx > 8) setTheme('dark')
    else if (dx < -8) setTheme('light')
    else setTheme(dark ? 'light' : 'dark')
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setTheme('dark') }
    if (e.key === 'ArrowLeft') { e.preventDefault(); setTheme('light') }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTheme(dark ? 'light' : 'dark') }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Tema escuro"
      title={dark ? 'Tema escuro — arraste para a esquerda para o claro' : 'Tema claro — arraste para a direita para o escuro'}
      className={`theme-switch ${dark ? 'is-dark' : 'is-light'}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (start.current = null)}
      onKeyDown={onKeyDown}
      data-solid
    >
      <span className="ts-icon ts-sun"><Icon name="sun" size={14} /></span>
      <span className="ts-icon ts-moon"><Icon name="moon" size={14} /></span>
      <span className="ts-knob">
        <Icon name={dark ? 'moon' : 'sun'} size={13} />
      </span>
    </button>
  )
}

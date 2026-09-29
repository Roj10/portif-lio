import { useEffect, useState } from 'react'
import Icon from '../components/Icons.jsx'
import { contacts, profile } from '../data.js'

function useTyped(words) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0])
      return
    }
    let w = 0, i = 0, deleting = false, timer
    const tick = () => {
      const word = words[w]
      i += deleting ? -1 : 1
      setText(word.slice(0, i))
      let delay = deleting ? 35 : 70
      if (!deleting && i === word.length) { deleting = true; delay = 1700 }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350 }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [words])
  return text
}

export default function Home() {
  const typed = useTyped(profile.roles)

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-text" data-solid>
        <p className="eyebrow reveal" style={{ '--i': 0 }}>
          <span className="status-dot" /> Aberto a oportunidades
        </p>
        <h1 id="hero-title" className="reveal" style={{ '--i': 1 }}>
          <span className="hello">Olá, eu sou</span>
          <span className="grad-text">{profile.name}</span>
        </h1>
        <p className="typed reveal" style={{ '--i': 2 }} aria-label={profile.roles.join(', ')}>
          <span className="mono">&gt;</span> {typed}<span className="caret" />
        </p>
        <p className="hero-lead reveal" style={{ '--i': 3 }}>
          Apaixonado por tecnologia desde pequeno — do hardware ao código. Crio sites e sistemas com
          REACT NATIVE, espero que gostem.
        </p>
        <div className="hero-actions reveal" style={{ '--i': 4 }}>
          <a href="#projetos" className="btn btn-primary">
            Ver projetos <Icon name="arrow" size={18} />
          </a>
          <a href="#contato" className="btn btn-ghost">Fale comigo</a>
        </div>
        <div className="socials reveal" style={{ '--i': 5 }}>
          <a href={contacts.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a>
          <a href={contacts.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
          <a href={contacts.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          <a href={`mailto:${contacts.email}`} aria-label="E-mail"><Icon name="mail" /></a>
        </div>
      </div>

      <p className="hint reveal" style={{ '--i': 7 }}>
        <Icon name="pointer" size={16} />
        <span className="hint-desktop">Passe o mouse e clique nas peças 3D</span>
        <span className="hint-mobile">Toque nas peças 3D</span>
      </p>
    </section>
  )
}

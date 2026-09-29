import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icons.jsx'
import { projects } from '../data.js'

const FILTERS = ['Todos', ...new Set(projects.map((p) => p.category))]

function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null)

  // Leve inclinação 3D acompanhando o mouse (só em telas com mouse)
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  const { links = {} } = project

  return (
    <article
      ref={ref}
      className="glass project-card reveal"
      style={{ '--i': index + 1 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-solid
    >
      <div className="project-media">
        {project.image ? (
          <button type="button" className="media-btn" onClick={() => onOpen(project)} aria-label={`Ampliar imagem de ${project.title}`}>
            <img
              src={project.image}
              alt={project.logo ? `Logo do ${project.title}` : `Captura de tela: ${project.title}`}
              className={project.logo ? 'is-logo' : undefined}
              loading="lazy"
            />
          </button>
        ) : (
          <div className="media-placeholder" aria-hidden="true">
            <span className="mono">
              <span className="ph-dim">&lt;</span>
              {project.title.split(' ')[0]}
              <span className="ph-dim"> /&gt;</span>
            </span>
          </div>
        )}
        <span className="cat-badge mono">{project.category}</span>
      </div>

      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="chip-list small">
          {project.tags.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
        <div className="project-links">
          {links.demo && (
            <a href={links.demo} target="_blank" rel="noreferrer" className="link-btn">
              <Icon name="external" size={16} /> Ver online
            </a>
          )}
          {links.code && (
            <a href={links.code} target="_blank" rel="noreferrer" className="link-btn">
              <Icon name="github" size={16} /> Código
            </a>
          )}
          {project.image && !project.logo && (
            <button type="button" className="link-btn" onClick={() => onOpen(project)}>
              <Icon name="external" size={16} /> Ver imagem
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('Todos')
  const [open, setOpen] = useState(null)
  const dialog = useRef(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const list = filter === 'Todos' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section className="section projects" aria-labelledby="projects-title">
      <header className="section-head reveal" style={{ '--i': 0 }}>
        <span className="mono tag-line">// projetos.map()</span>
        <h2 id="projects-title">Projetos</h2>
        <p className="muted">Trabalhos do curso técnico, estudos e projetos pessoais.</p>
      </header>

      <div className="filters reveal" style={{ '--i': 1 }} role="group" aria-label="Filtrar projetos" data-solid>
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`filter ${filter === f ? 'active' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="project-grid" key={filter}>
        {list.map((p, i) => <ProjectCard key={p.title} project={p} index={i} onOpen={setOpen} />)}
      </div>

      <dialog ref={dialog} className="lightbox" onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && setOpen(null)}>
        {open && (
          <figure>
            <button type="button" className="lightbox-close" onClick={() => setOpen(null)} aria-label="Fechar">
              <Icon name="close" />
            </button>
            <img src={open.image} alt={`Captura de tela: ${open.title}`} />
            <figcaption>{open.title}</figcaption>
          </figure>
        )}
      </dialog>
    </section>
  )
}

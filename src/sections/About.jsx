import Icon from '../components/Icons.jsx'
import { profile, skills, timeline } from '../data.js'

export default function About() {
  return (
    <section className="section about" aria-labelledby="about-title">
      <header className="section-head reveal" style={{ '--i': 0 }}>
        <span className="mono tag-line">// sobre.mim</span>
        <h2 id="about-title">Quem sou eu?</h2>
      </header>

      <div className="about-grid">
        <aside className="glass profile-card reveal" style={{ '--i': 1 }} data-solid>
          <div className="avatar">
            <img src={profile.photo} alt={`Foto de ${profile.name}`} width="220" height="220" />
          </div>
          <h3>{profile.fullName}</h3>
          <p className="muted"><Icon name="pin" size={16} /> {profile.location}</p>
          <p className="mono role-chip">Full-stack Developer</p>
        </aside>

        <div className="glass about-text reveal" style={{ '--i': 2 }} data-solid>
          <p>
            Olá! Me chamo <strong>{profile.fullName}</strong>. Sou de Jacarezinho, no Paraná, e moro em
            Florianópolis há mais de 17 anos.
          </p>
          <p>
            Estudo no <strong>SESI SENAI</strong> no curso técnico integrado de TI, aprendendo a construir
            sites e sistemas, resolver problemas, planejar projetos e trabalhar em equipe.
          </p>
          <p>
            Desde pequeno gosto de eletrônicos e tecnologia em geral, já mexia em computadores e hoje monto
            PCs e faço manutenções. Hoje estou evoluindo dentro da <strong className="accent">Hub Floripa</strong>, onde com pessoas incríveis estou me tornando uma pessoa melhor e preparado para esse mundo corporativo.{' '}
           Agora sigo em frente porque nada melhor do que trabalhar com o que se gosta.
          </p>
        </div>

        <div className="glass skills reveal" style={{ '--i': 3 }} data-solid>
          <h3><Icon name="code" size={18} /> Tecnologias</h3>
          <ul className="chip-list">
            {skills.map((s) => <li key={s} className="chip">{s}</li>)}
          </ul>
        </div>

        <div className="glass timeline-card reveal" style={{ '--i': 4 }} data-solid>
          <h3>Formação &amp; experiência</h3>
          <ol className="timeline">
            {timeline.map((t) => (
              <li key={t.title}>
                <span className="mono period">{t.period}</span>
                <strong>{t.title}</strong>
                <span className="muted">{t.place}</span>
                {t.text && <p>{t.text}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import Icon from '../components/Icons.jsx'
import { contacts } from '../data.js'

// Envio sem back-end via FormSubmit (https://formsubmit.co).
// No PRIMEIRO envio, o FormSubmit manda um e-mail de ativação para o endereço abaixo — é só confirmar.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${contacts.email}`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState('')

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'Digite um e-mail válido.'
    if (form.message.trim().length < 5) er.message = 'Escreva uma mensagem (mín. 5 caracteres).'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (form.website) { setStatus('sent'); return } // honeypot anti-spam
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nome: form.name.trim() || '(não informado)',
          email: form.email.trim(),
          mensagem: form.message.trim(),
          _subject: `Portfólio: nova mensagem de ${form.name.trim() || form.email.trim()}`,
          _replyto: form.email.trim(),
          _template: 'table',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'Falha no envio')
      setStatus('sent')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch {
      setStatus('error')
    }
  }

  const mailtoFallback = `mailto:${contacts.email}?subject=${encodeURIComponent('Contato pelo portfólio')}&body=${encodeURIComponent(form.message)}`

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(''), 1800)
    } catch { /* clipboard indisponível */ }
  }

  const channels = [
    { key: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp', value: contacts.phoneDisplay, href: contacts.whatsapp, external: true },
    { key: 'phone', icon: 'phone', label: 'Telefone', value: contacts.phoneDisplay, href: `tel:${contacts.phoneE164}`, copy: contacts.phoneDisplay },
    { key: 'email', icon: 'mail', label: 'Gmail', value: contacts.email, href: `mailto:${contacts.email}`, copy: contacts.email },
    { key: 'github', icon: 'github', label: 'GitHub', value: `github.com/${contacts.githubUser}`, href: contacts.github, external: true },
    { key: 'linkedin', icon: 'linkedin', label: 'LinkedIn', value: 'Renan Jussiani', href: contacts.linkedin, external: true },
  ]

  return (
    <section className="section contact" aria-labelledby="contact-title">
      <header className="section-head reveal" style={{ '--i': 0 }}>
        <span className="mono tag-line">// contato.send()</span>
        <h2 id="contact-title">Vamos conversar?</h2>
        <p className="muted">Deixe seu e-mail e uma mensagem, ou me chame por um dos canais abaixo.</p>
      </header>

      <div className="contact-grid">
        <form className="glass contact-form reveal" style={{ '--i': 1 }} onSubmit={onSubmit} noValidate data-solid>
          {status === 'sent' ? (
            <div className="form-success" role="status">
              <span className="success-icon"><Icon name="check" size={28} /></span>
              <h3>Mensagem enviada!</h3>
              <p className="muted">Obrigado pelo contato — vou responder no seu e-mail assim que possível.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>Enviar outra</button>
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="c-name">Nome <span className="muted">(opcional)</span></label>
                <input id="c-name" type="text" autoComplete="name" value={form.name} onChange={update('name')} placeholder="Seu nome" />
              </div>
              <div className="field">
                <label htmlFor="c-email">Seu e-mail</label>
                <input
                  id="c-email" type="email" autoComplete="email" inputMode="email" required
                  value={form.email} onChange={update('email')} placeholder="voce@email.com"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined}
                />
                {errors.email && <span id="e-email" className="field-error">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="c-msg">Mensagem</label>
                <textarea
                  id="c-msg" rows="6" required value={form.message} onChange={update('message')}
                  placeholder="Escreva aqui sua mensagem…" maxLength={2000}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-msg' : undefined}
                />
                <span className="counter mono">{form.message.length}/2000</span>
                {errors.message && <span id="e-msg" className="field-error">{errors.message}</span>}
              </div>
              {/* honeypot: invisível para pessoas */}
              <input className="hp" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} aria-hidden="true" />

              {status === 'error' && (
                <p className="form-error" role="alert">
                  Não foi possível enviar agora. <a href={mailtoFallback}>Enviar pelo seu app de e-mail</a>.
                </p>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
                {status === 'sending' ? <><span className="spinner" /> Enviando…</> : <>Enviar mensagem <Icon name="send" size={18} /></>}
              </button>
            </>
          )}
        </form>

        <ul className="channels">
          {channels.map((c, i) => (
            <li key={c.key} className="glass channel reveal" style={{ '--i': i + 2 }} data-solid>
              <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})} className="channel-link">
                <span className={`channel-icon ci-${c.key}`}><Icon name={c.icon} size={22} /></span>
                <span className="channel-text">
                  <span className="channel-label">{c.label}</span>
                  <span className="channel-value">{c.value}</span>
                </span>
              </a>
              {c.copy && (
                <button type="button" className="copy-btn" onClick={() => copy(c.copy, c.key)} aria-label={`Copiar ${c.label}`} title="Copiar">
                  <Icon name={copied === c.key ? 'check' : 'copy'} size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

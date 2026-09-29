// Todo o conteúdo do portfólio fica aqui — edite à vontade.
import perfil from './assets/img/perfil.webp'
import welnan from './assets/img/welnan.webp'
import starFalcons from './assets/img/starfalcons.webp'
import cronograma from './assets/img/cronograma-crm.png'

export const profile = {
  name: 'Renan Jussiani',
  fullName: 'Renan de Oliveira Jussiani',
  location: 'Florianópolis · SC',
  photo: perfil,
  roles: [
    'Desenvolvedor Full-stack',
    'Front-end com React',
    'Back-end com Node.js & SQL',
    'Montador de PCs nas horas vagas',
  ],
}

export const contacts = {
  email: 'renanjussiani@gmail.com',
  phoneDisplay: '(48) 98858-9650',
  phoneE164: '+5548988589650',
  whatsapp: 'https://wa.me/5548988589650',
  github: 'https://github.com/Roj10',
  githubUser: 'Roj10',
  linkedin: 'https://www.linkedin.com/in/renan-jussiani-223468257/',
  instagram: 'https://www.instagram.com/renan_jussiani/',
}

export const skills = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express',
  'SQL', 'Python', 'Java', 'Git & GitHub', 'Figma', 'Cybersecurity',
]

export const timeline = [
  {
    period: 'atual',
    title: 'Superior em ADS + Hub Floripa',
    place: 'SESI SENAI · Florianópolis',
    text: 'Cursando Análise e Desenvolvimento de Sistemas e evoluindo profissionalmente na Hub Floripa, em um ambiente com pessoas incríveis.',
  },
  {
    period: '2023 — 2026',
    title: 'Técnico e Suporte de TI',
    place: 'UDESC',
    text: 'Suporte técnico aos usuários, manutenção de computadores e resolução de problemas de TI.',
  },
  {
    period: '2021 — 2024',
    title: 'Ensino Médio + Técnico em TI',
    place: 'SESI SENAI',
    text: 'Desenvolvimento web, banco de dados, APIs, metodologias ágeis e trabalho em equipe.',
  },
  {
    period: '2021 — 2022',
    title: 'Cursos Cisco',
    place: 'Cisco Networking Academy',
    text: '3 cursos de Cybersecurity, IoT, Python e Linux.',
  },
  {
    period: '2011 — 2021',
    title: 'Ensino Fundamental',
    place: 'E.E.B. Albertina Madalena Dias',
    text: '',
  },
]

// category: usado pelos filtros da aba Projetos
// logo: true = a imagem é uma logo (aparece inteira, sem cortar)
export const projects = [
  {
    title: 'Welnan · Mini Salgados',
    category: 'Full-stack',
    description: 'Site de pedidos e painel de gestão para uma fábrica familiar de salgados: cardápio com filtros, carrinho com envio do pedido pelo WhatsApp e painel com pedidos, estoque de materiais, custos e margem de lucro.',
    tags: ['React', 'TypeScript', 'Go', 'PostgreSQL', 'Supabase'],
    image: welnan,
    logo: true,
    links: { code: 'https://github.com/Roj10/welnan' },
  },
  {
    title: 'Star Falcons',
    category: 'Full-stack',
    description: 'Site da equipe de CS2 Star Falcons: elenco, rotinas de treino com cronômetro e checklist, login por jogador e um editor de táticas em mapa 2D com linha do tempo e granadas animadas.',
    tags: ['React', 'Go', 'PostgreSQL', 'JWT'],
    image: starFalcons,
    logo: true,
    links: { code: 'https://github.com/Roj10/Star-Falcon' },
  },
  {
    title: 'SmartStock',
    category: 'Full-stack',
    description: 'Controle de estoque de pastilhas industriais feito para o desafio da DDA Metalúrgica (SENAI/SC): entradas e saídas, alertas de estoque mínimo, histórico e dashboard.',
    tags: ['Java', 'Spring Boot', 'React', 'JWT'],
    links: { code: 'https://github.com/Roj10/SmartStock' },
  },
  {
    title: 'Automação com Bash',
    category: 'Infra',
    description: 'Scripts para Linux que criam grupos e pastas de projeto com as permissões certas e geram um relatório diário dos arquivos alterados, prontos para agendar no cron.',
    tags: ['Bash', 'Linux', 'Cron'],
    links: { code: 'https://github.com/Roj10/Desafio-1---Eletiva-I' },
  },
  {
    title: 'Cronograma de Implantação de CRM',
    category: 'Gestão',
    description: 'Planejamento do desenvolvimento de um sistema para uma empresa, com tarefas, prazos e responsáveis.',
    tags: ['Scrum', 'Wrike'],
    image: cronograma,
  },
]

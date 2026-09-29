# Portfólio — Renan Jussiani

Portfólio em **React + Vite** com cena 3D animada (**React Three Fiber**): teclado, mouse, placa-mãe,
placa de vídeo, monitor, memória RAM e processador — todos modelados em código.

## Rodar

```bash
npm install
npm run dev
```

Depois abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

Build de produção (pasta `dist/`): `npm run build`, e para testar a build: `npm run preview`.

### Em outro computador

1. Instale o [Node.js](https://nodejs.org) (versão LTS).
2. Abra o terminal na pasta do projeto e rode `npm install` (só na primeira vez — baixa a pasta `node_modules`).
3. Rode `npm run dev`.

### Erro "a execução de scripts foi desabilitada neste sistema" (Windows / PowerShell)

Se aparecer algo como:

```
npm : O arquivo C:\Program Files\nodejs\npm.ps1 não pode ser carregado porque a execução
de scripts foi desabilitada neste sistema.
```

Não é problema do projeto: o PowerShell vem bloqueando scripts `.ps1` por padrão, e o `npm`
no PowerShell é um desses scripts. Escolha uma das soluções:

- **Mais simples:** use a versão `.cmd` do npm, que não é bloqueada:
  ```
  npm.cmd install
  npm.cmd run dev
  ```
- **Outro terminal:** use o **Prompt de Comando (cmd)** ou o **Git Bash** em vez do PowerShell;
  lá o `npm run dev` funciona normalmente.
- **Resolver de vez:** libere scripts só para o seu usuário (rode uma vez no PowerShell e confirme com `S`):
  ```
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```
  O `RemoteSigned` deixa rodar scripts criados no próprio computador e só exige assinatura
  de scripts baixados da internet — é o modo recomendado pela Microsoft para quem programa.

### Porta ocupada

Se a porta 5173 já estiver em uso (por exemplo, outro `npm run dev` aberto), o Vite usa a
próxima livre (5174, 5175…). Use sempre o endereço que o terminal mostrar.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Textos, projetos, tecnologias, formação e contatos | `src/data.js` |
| Cores dos temas escuro/claro (site) | `src/styles.css` (topo do arquivo) |
| Cores dos objetos 3D | `src/three/palette.js` |
| Posições das peças 3D em cada aba | `src/three/Scene.jsx` (`HOME_WIDE`, `HOME_TALL`, `RING`) |
| Modelos 3D | `src/three/models.jsx` |

## Formulário de contato

O formulário envia pelo [FormSubmit](https://formsubmit.co) direto para `renanjussiani@gmail.com`,
sem precisar de servidor. **No primeiro envio** chega um e-mail de ativação do FormSubmit — confirme uma
vez e as próximas mensagens chegam normalmente. Se o envio falhar, o site oferece abrir o app de e-mail.

## Publicar no GitHub Pages

O `vite.config.js` usa `base: './'`, então é só publicar o conteúdo da pasta `dist/`
(por exemplo, numa branch `gh-pages` ou com a action oficial do Pages).

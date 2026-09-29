import { createContext, useContext } from 'react'

// Cores dos objetos 3D em cada tema (azul escuro, azul claro, ciano, preto, cinza, branco)
export const PALETTES = {
  dark: {
    body: '#0e1830',
    body2: '#1b2b4d',
    metal: '#8fa4c2',
    pcb: '#0b2452',
    key: '#131e36',
    slot: '#050a14',
    accent: '#00e5ff',
    accent2: '#2f7bff',
    gold: '#d6ab45',
    glow: 2.4,
    grid: '#1d4ed8',
    sparkle: '#4ea8ff',
    editor: {
      bg: '#050c1c', bar: '#0b1730', gutter: '#3a4a66', text: '#e6edf7', kw: '#4ea8ff',
      str: '#00e5ff', num: '#ffb86b', com: '#5d6c86', punct: '#8b97ad', fn: '#9ccfff', caret: '#00e5ff',
    },
  },
  light: {
    body: '#f2f7fe',
    body2: '#cfe1f8',
    metal: '#b4c5dc',
    pcb: '#78b1ff',
    key: '#ffffff',
    slot: '#8fa9cc',
    accent: '#27c9f0',
    accent2: '#6aa8ff',
    gold: '#e6c066',
    glow: 1.1,
    grid: '#7cb8ff',
    sparkle: '#5aa7ff',
    editor: {
      bg: '#f7fbff', bar: '#e2eefc', gutter: '#9fb3cf', text: '#0b1b36', kw: '#1d5fe0',
      str: '#0891b2', num: '#c2410c', com: '#94a3b8', punct: '#64748b', fn: '#2563eb', caret: '#0891b2',
    },
  },
}

export const PaletteContext = createContext(PALETTES.dark)
export const usePalette = () => useContext(PaletteContext)

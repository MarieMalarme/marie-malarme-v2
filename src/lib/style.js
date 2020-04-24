import { wrapper } from 'dallas'
import { toDashCase } from './toolbox.js'

const tints = [
  'grey',
  'red',
  'scarlet',
  'sanguine',
  'orange',
  'saffron',
  'yellow',
  'canary',
  'lime',
  'chartreuse',
  'spring',
  'grass',
  'neon',
  'green',
  'meadow',
  'parrot',
  'alga',
  'mint',
  'jade',
  'cyan',
  'cerulean',
  'azur',
  'king',
  'electric',
  'deepsea',
  'blue',
  'sapphire',
  'indigo',
  'purple',
  'violet',
  'fuschia',
  'magenta',
  'candy',
  'pink',
  'barbie',
  'raspberry',
  'cherry',
]

const camaieu = (name, hue) =>
  [...Array(9).keys()].map((i) => [
    `${name}${i + 1}`,
    `hsl(${hue}, ${name === 'grey' ? '0' : '100'}%, ${(i + 1) * 10}%)`,
  ])

const shades = Object.fromEntries(
  tints.flatMap((name, i) => camaieu(name, (i + 1) * 10)),
)

export const colors = Object.entries({
  white: '#ffffff',
  black: '#000000',
  ...shades,
})

const measures = [...Array(100).keys()].map((m) => (m + 1) * 5)
const pixels = measures.map((p) => `  --px${p}: ${p}px;`)

const directions = [
  { a: '' },
  { t: '-top' },
  { r: '-right' },
  { b: '-bottom' },
  { l: '-left' },
]

const pixelateDirections = (selector) => {
  return Object.assign(
    ...directions.map((obj) =>
      Object.assign(
        ...Object.entries(obj).map(([suffix, direction]) =>
          pixelate(selector, suffix, direction),
        ),
      ),
    ),
  )
}

const pixelate = (selector, suffix = '', direction = '') => {
  const prefix = selector[0]
  const isFunction = typeof selector === 'function'
  return Object.assign(
    ...measures.map(
      (measure) =>
        (isFunction && selector(measure)) || {
          [`${prefix}${suffix}${measure}`]: `${selector}${direction}: ${measure}px`,
        },
    ),
  )
}

const pixelateAxis = (selector) => {
  const prefix = selector[0]
  return {
    ...pixelate((measure) => ({
      [`${prefix}v${measure}`]: `${selector}-top: ${measure}px; ${selector}-bottom: ${measure}px;`,
    })),
    ...pixelate((measure) => ({
      [`${prefix}h${measure}`]: `${selector}-left: ${measure}px; ${selector}-right: ${measure}px;`,
    })),
  }
}

const percentages = [...Array(21).keys()].map((p) => p * 5)

const percentage = (selector) => {
  const prefix = selector[0]
  return Object.assign(
    ...percentages.map((percentage) => ({
      [`${prefix}${percentage}p`]: `${selector}: ${percentage}%`,
    })),
  )
}

const display = [
  'block',
  'inline',
  'flex',
  'table',
  'grid',
  'flow',
  'none',
  'inlineBlock',
  'inlineFlex',
]

export const generated = {
  color: Object.assign(
    ...colors.map(([color, value]) => ({
      [color]: `color: var(--${color})`,
    })),
  ),
  fontSize: Object.assign(
    ...[...Array(31).keys()].map((i) => ({
      [`fs${i + 10}`]: `font-size: ${i + 10}px`,
    })),
  ),
  margin: { ...pixelateDirections('margin'), ...pixelateAxis('margin') },
  padding: { ...pixelateDirections('padding'), ...pixelateAxis('padding') },
  width: { ...percentage('width'), ...pixelate('width') },
  height: { ...percentage('height'), ...pixelate('height') },
  display: Object.assign(
    ...display.map((d) => ({ [d]: `display: ${toDashCase(d)}` })),
  ),
}

export const core = {
  murmure: `font-family: 'Murmure'`,
  graebenbach: `font-family: 'Graebenbach'`,
}

const classes = { ...Object.assign(...Object.values(generated)), ...core }

const injectCSS = (classes) =>
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      type: 'text/css',
      id: 'mm-flags',
      innerHTML: [
        ':root {',
        '/* measures */',
        pixels.join('\n'),
        '/* colors */',
        colors.map(([color, value]) => `  --${color}: ${value};`).join('\n'),
        '}\n',
        Object.entries(classes)
          .map(([selector, rules]) => `.${selector} { ${rules}; }`)
          .join('\n'),
      ].join('\n'),
    }),
  )

injectCSS(classes)

const flags = Object.assign(...Object.keys(classes).map((c) => ({ [c]: c })))

export const Component = wrapper({ ...flags, consume: true })

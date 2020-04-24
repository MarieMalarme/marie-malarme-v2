import { wrapper } from 'dallas'
import { toDashCase, capitalize, array } from './toolbox.js'

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
  array(9).map((i) => [
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

const measures = array(100).map((m) => (m + 1) * 5)
const pixels = measures.map((p) => `  --px${p}: ${p}px;`)

const directions = Object.entries({
  a: '',
  t: '-top',
  r: '-right',
  b: '-bottom',
  l: '-left',
})

const generate = (data, mapper) => Object.assign(...data.map(mapper))

const pixelate = (selector, suffix = '', direction = '') => {
  const prefix = selector[0]
  const isFunction = typeof selector === 'function'
  return generate(
    measures,
    (measure) =>
      (isFunction && selector(measure)) || {
        [`${prefix}${suffix}${measure}`]: `${selector}${direction}: ${measure}px`,
      },
  )
}

const pixelateDirections = (selector) => {
  return Object.assign(
    ...directions.map(([suffix, direction]) =>
      pixelate(selector, suffix, direction),
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

const percentages = array(21).map((p) => p * 5)

const percentage = (selector) => {
  const prefix = selector[0]
  return generate(percentages, (percentage) => ({
    [`${prefix}${percentage}p`]: `${selector}: ${percentage}%`,
  }))
}

const displays = [
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

const flexAlignments = [
  'center',
  'start',
  'end',
  'flexStart',
  'flexEnd',
  'baseline',
  'firstBaseline',
  'lastBaseline',
]

const flexJustifications = [
  'center',
  'start',
  'end',
  'flexStart',
  'flexEnd',
  'left',
  'right',
  'spaceBetween',
  'spaceAround',
  'spaceEvenly',
]

const flexAlign = generate(flexAlignments, (a) => ({
  [`align${capitalize(a)}`]: `align-items: ${toDashCase(a)}`,
}))

const flexJustify = generate(flexJustifications, (j) => {
  const suffix = capitalize(j.replace('space', ''))
  return {
    [`justify${suffix}`]: `justify-content: ${toDashCase(j)}`,
  }
})

const flexWrap = generate(['noWrap', 'wrap', 'wrapReverse'], (w) => ({
  [`flex${capitalize(w)}`]: `flex-wrap: ${toDashCase(w)}`,
}))

const positions = ['static', 'relative', 'absolute', 'fixed', 'sticky']

const cursors = [
  'default',
  'pointer',
  'text',
  'move',
  'grab',
  'zoomIn',
  'zoomOut',
]

export const core = {
  murmure: `font-family: 'Murmure'`,
  graebenbach: `font-family: 'Graebenbach'`,
  flexColumn: `flex-direction: column`,
  flexRow: `flex-direction: row`,
  bRad50p: `border-radius: 50%`,
}

export const generated = {
  color: generate(colors, ([color]) => ({ [color]: `color: var(--${color})` })),
  backgroundColor: generate(colors, ([color]) => ({
    [`bg${capitalize(color)}`]: `background-color: var(--${color})`,
  })),
  fontSize: generate(array(31), (i) => ({
    [`fs${i + 10}`]: `font-size: ${i + 10}px`,
  })),
  margin: { ...pixelateDirections('margin'), ...pixelateAxis('margin') },
  padding: { ...pixelateDirections('padding'), ...pixelateAxis('padding') },
  width: { ...percentage('width'), ...pixelate('width') },
  height: { ...percentage('height'), ...pixelate('height') },
  display: generate(displays, (d) => ({ [d]: `display: ${toDashCase(d)}` })),
  flex: { ...flexAlign, ...flexJustify, ...flexWrap },
  border: generate(directions, ([suffix, direction]) => ({
    [`b${suffix}`]: `border${direction}: solid 1px black`,
  })),
  borderColor: generate(colors, ([color]) => ({
    [`b${capitalize(color)}`]: `border-color: var(--${color})`,
  })),
  position: generate(positions, (p) => ({ [p]: `position: ${p}` })),
  cursor: generate(cursors, (c) => ({
    [c]: `cursor: ${toDashCase(c)}`,
  })),
}

const classes = { ...core, ...Object.assign({}, ...Object.values(generated)) }

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

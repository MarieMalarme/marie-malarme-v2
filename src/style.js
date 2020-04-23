import React from 'react'
import { wrapper } from 'dallas'

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

const pixels = [...Array(100).keys()].map(
  (i) => `  --px${(i + 1) * 5}: ${(i + 1) * 5}px;`,
)

const core = {
  colors: Object.entries(shades).map(([color, value]) => [
    `${color}`,
    `color: var(--${color})`,
  ]),
}

const classes = Object.assign(...Object.values(core))

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
        classes
          .map(([selector, rules]) => `.${selector} { ${rules}; }`)
          .join('\n'),
      ].join('\n'),
    }),
  )

injectCSS(classes)

const flags = Object.assign({}, ...classes.map((c) => ({ [c[0]]: c[0] })))

export const Component = wrapper({ ...flags, consume: true })

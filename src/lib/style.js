import { toDashCase, capitalize, array, generate } from './toolbox.js'
import {
  displays,
  flexAlignments,
  flexJustifications,
  positions,
  cursors,
  whiteSpaces,
  transitions,
  directions,
} from './css.js'

import { colors } from './colors.js'
import {
  pixels,
  pixelate,
  pixelateDirections,
  pixelateAxis,
  percentage,
} from './measures.js'

export const core = {
  heading: `font-family: 'Murmure'`,
  current: `font-family: 'Archiv'`,
  mono: `font-family: 'SpaceMono'`,
  flexColumn: `flex-direction: column`,
  flexRow: `flex-direction: row`,
  bRad50p: `border-radius: 50%`,
  w100vw: `width: 100vw`,
  h100vh: `height: 100vh`,
  fs100: `font-size: 100px`,
  noDecoration: `text-decoration: none`,
  t0: `top: 0`,
  r0: `right: 0`,
  b0: `bottom: 0`,
  l0: `left: 0`,
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
  flex: {
    ...generate(flexAlignments, (a) => ({
      [`align${capitalize(a)}`]: `align-items: ${toDashCase(a)}`,
    })),
    ...generate(flexJustifications, (j) => ({
      [`justify${capitalize(
        j.replace('space', ''),
      )}`]: `justify-content: ${toDashCase(j)}`,
    })),
    ...generate(['noWrap', 'wrap', 'wrapReverse'], (w) => ({
      [`flex${capitalize(w)}`]: `flex-wrap: ${toDashCase(w)}`,
    })),
  },
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
  lineHeight: generate(array(41), (i) => ({
    [`lh${i + 10}`]: `line-height: ${i + 10}px`,
  })),
  whiteSpace: generate(whiteSpaces, (w) => ({
    [`ws${capitalize(w)}`]: `white-space: ${toDashCase(w)}`,
  })),
  transition: generate(transitions, (t) => ({
    [`anim${capitalize(t)}`]: `transition: ${toDashCase(t)} 0.2s ease-in-out`,
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

export const flags = Object.assign(
  ...Object.keys(classes).map((c) => ({ [c]: c })),
)

import { array, generate } from './toolbox.js'
import { directions } from './css.js'

export const measures = array(101).map((m) => m * 5)

export const pixels = measures.map((p) => `  --px${p}: ${p}px;`)

export const pixelate = (selector, suffix = '', direction = '') => {
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

export const pixelateDirections = (selector) => {
  return Object.assign(
    ...directions.map(([suffix, direction]) =>
      pixelate(selector, suffix, direction),
    ),
  )
}

export const pixelateAxis = (selector) => {
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

export const percentage = (selector) => {
  const prefix = selector[0]
  return generate(percentages, (percentage) => ({
    [`${prefix}${percentage}p`]: `${selector}: ${percentage}%`,
  }))
}

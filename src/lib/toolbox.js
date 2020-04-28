import { Children, Fragment, isValidElement } from 'react'

export const toDashCase = (string) =>
  string
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const array = (number) => [...Array(number).keys()]

export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generate = (data, mapper) => Object.assign(...data.map(mapper))

export const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2, 7)
    .padEnd(5, '#')

const regex = /[.$]/g
const clean = (k) => {
  const key = k
    .replace(regex, '')
    .toLowerCase()
    .split(' ')
    .join('-')
  if (key.length < 2) return generateId()
  return key
}

const ignored = (node) =>
  typeof node === 'string' || typeof node === 'number' || !isValidElement(node)

export const flatten = (children) =>
  Children.toArray(children).reduce((acc, node) => {
    if (ignored(node)) return acc
    const { type, props, key } = node
    const isFragment = type === Fragment
    const nodes = isFragment
      ? flatten(props.children)
      : [{ ...node, key: clean(key) }]
    return [...acc, ...nodes]
  }, [])

import React, { useEffect, useState } from 'react'
import { random } from '../lib/toolbox.js'

import { Component, Div } from '../lib/design.js'
import { Page, Title, Instruction, Mode } from './demos.js'

const keyboard = '1234567890-qwertyuiop-asdfghjkl-zxcvbnm'
const keySets = keyboard.split('-')
const rows = [...keySets, 'Space']

const increment = 25

export const TypeVisualization = () => {
  const [circles, setCircles] = useState([])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [mode, setMode] = useState('multiple')

  const multiple = mode === 'multiple'

  useEffect(() => {
    setText('')
    setCircles([])
    setTyping(false)
  }, [mode])

  useEffect(() => {
    const handleKey = ({ key, keyCode }) => {
      if (typing) return
      const space = keyCode === 32
      if ((!keyboard.includes(key) && !space) || key === '-') return

      setTyping(true)
      setText(`${text}${key}`)

      const background = getBackground(key)

      multiple
        ? setCircles([...circles, newCircle(circles, key, space, background)])
        : increaseCircle(space, key, background)

      setTyping(false)
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [circles, text, typing, multiple])

  useEffect(() => {
    const handleControls = ({ key }) => {
      if (!text.length) return

      if (key === 'Backspace') {
        setText(text.slice(0, text.length - 1))
        multiple
          ? setCircles(circles.slice(0, circles.length - 1))
          : decreaseCircle(text)
      }

      if (key === 'Escape') {
        setText('')
        multiple ? setCircles([]) : resetCircles()
      }
    }

    document.addEventListener('keydown', handleControls)
    return () => document.removeEventListener('keydown', handleControls)
  }, [text, multiple, circles])

  return (
    <Page noSelect>
      <Title style={{ wordBreak: 'break-all' }} w90p textCenter zi5>
        {text || 'Type visualization'}
      </Title>
      {!text && (
        <Instruction zi5>Type anything — Press Escape to clear</Instruction>
      )}
      <Keyboard rows={rows} multiple={multiple} />
      <Modes mode={mode} setMode={setMode} />
      {circles.map((circle, i) => (
        <Circle key={`circle-${i}`} style={{ ...circle }} />
      ))}
    </Page>
  )
}

const Keyboard = ({ rows, multiple }) => (
  <Keys>
    {rows.map((row, i) => (
      <Letters row={row} multiple={multiple} key={i} />
    ))}
  </Keys>
)

const Letters = ({ row, multiple }) => (
  <Row>
    {(row === 'Space' && <Space multiple={multiple} />) ||
      row.split('').map((key) => (
        <Key id={key} key={key} style={{ width: '9%' }}>
          <Letter>{key}</Letter>
          {!multiple && <Circle className="circle" id={`circle-${key}`} />}
        </Key>
      ))}
  </Row>
)

const Space = ({ multiple }) => (
  <Key id="Space" style={{ width: '45%' }}>
    <Letter>Space</Letter>
    {!multiple && <Circle className="circle" id="circle-Space" />}
  </Key>
)

const Keys = Component.pv100.absolute.h100p.w100p.flex.flexColumn.justifyCenter.div()
const Row = Component.flex.ma5.h30p.justifyCenter.div()
const Key = Component.ba.ma5.w100p.h100p.flex.alignCenter.justifyCenter.div()
const Letter = Component.zi15.fs20.div()
const Circle = Component.zi10.absolute.bRad50p.bgPurple5.div()

const modes = ['multiple', 'single']

const Modes = ({ mode, setMode }) => (
  <Div flex fixed style={{ bottom: '250px' }}>
    {modes.map((m) => (
      <Mode
        key={m}
        clear
        caption={m}
        selected={m === mode}
        onClick={() => setMode(m)}
      />
    ))}
  </Div>
)

const getBackground = (key) => {
  const keys = keySets.join().split('')
  const currentKey = keys.indexOf(key)
  const lastKey = keys.length - 1
  const hue = (360 * currentKey) / lastKey
  const color = `hsl(${hue}, 50%, 50%)`
  const background = `radial-gradient(${color} 10%, transparent 60%)`
  return background
}

const newCircle = (circles, key, space, background) => {
  const keyCircles = circles.filter((c) => c.key === key).length
  const diameter = increment * (keyCircles || 1)
  const width = `${diameter}px`

  const area = document
    .getElementById((space && 'Space') || key)
    .getBoundingClientRect()
  const top = `${random(area.top, area.bottom - diameter)}px`
  const left = `${random(area.left, area.right - diameter)}px`

  return { top, left, key, background, width, height: width }
}

const increaseCircle = (space, key, background) => {
  const id = (space && `circle-Space`) || `circle-${key}`
  const circle = document.getElementById(id)
  const currentWidth = circle.getBoundingClientRect().width
  circle.style.height = `${currentWidth + increment}px`
  circle.style.width = `${currentWidth + increment}px`
  circle.style.background = background
}

const decreaseCircle = (text) => {
  const lastLetter = text[text.length - 1]
  const circle = document.getElementById(
    `circle-${(lastLetter === ' ' && 'Space') || lastLetter}`,
  )
  const currentWidth = circle.getBoundingClientRect().width
  circle.style.height = `${currentWidth - increment}px`
  circle.style.width = `${currentWidth - increment}px`
}

const resetCircles = () => {
  const circles = [...document.querySelectorAll('.circle')]
  circles.forEach((circle) => {
    circle.style.width = 0
    circle.style.height = 0
  })
}

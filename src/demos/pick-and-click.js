import React, { useEffect, useState } from 'react'

import { Div } from '../lib/design.js'
import { Page, Title, Instruction, Mode } from './demos.js'

const modes = ['vertical', 'horizontal', '35deg']

export const PickAndClick = () => {
  const [mode, setMode] = useState(modes[1])
  const [repeat, setRepeat] = useState(1)
  const [color, setColor] = useState({
    hue1: 0,
    hue2: 180,
  })

  const { hue1, hue2 } = color

  useEffect(() => {
    const update = (e) => {
      setColor({
        ...color,
        hue1: (e.pageX * 360) / window.innerWidth,
        hue2: (e.pageY * 360) / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  })

  const rotation =
    (mode === 'horizontal' && '0deg') ||
    (mode === 'vertical' && '90deg') ||
    mode

  return (
    <Page
      style={{
        backgroundImage: `linear-gradient(
        ${rotation},
        hsl(${hue1}, 50%, 70%) 0%,
        hsl(${hue2}, 50%, 70%) 25%,
        hsl(${hue1 - 180}, 50%, 70%) 48%,
        hsl(${hue1 - 180}, 50%, 70%) 52%,
        hsl(${hue2}, 50%, 70%) 75%,
        hsl(${hue1}, 50%, 70%) 100%)`,
        backgroundSize: `${
          window.innerWidth / (mode === 'vertical' ? repeat : 1)
        }px ${window.innerHeight / repeat}px`,
      }}
    >
      <Title>Pick and click</Title>
      <Instruction>Move the mouse — click to pick</Instruction>
      <Modes
        repeat={repeat}
        setRepeat={setRepeat}
        mode={mode}
        setMode={setMode}
      />
    </Page>
  )
}

const Modes = ({ repeat, setRepeat, mode, setMode }) => (
  <Div flex fixed style={{ bottom: '250px' }}>
    <Mode caption="decrease" onClick={() => setRepeat(repeat - 1)} />
    {modes.map((m) => (
      <Mode
        key={m}
        caption={m}
        selected={m === mode}
        onClick={() => setMode(m)}
      />
    ))}
    <Mode caption="increase" onClick={() => setRepeat(repeat + 1)} />
  </Div>
)

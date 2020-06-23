import React, { useState, useEffect } from 'react'

import { random } from '../lib/toolbox.js'

import { Page, Title, Instruction } from './demos.js'

export const MoveAndDraw = () => {
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.shadowColor = 'white'
    ctx.shadowBlur = blurModes[random(0, blurModes.length)]
    setContext(ctx)
    canvas.addEventListener('click', (e) => {
      canvas.style.mixBlendMode = blendModes[random(0, blendModes.length - 1)]
      ctx.shadowBlur = blurModes[random(0, blurModes.length - 1)]
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })
  }, [canvas])

  useEffect(() => {
    const resize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  })

  return (
    <Page>
      <Title>Move and draw</Title>
      <Instruction>Move the mouse — click to start over</Instruction>
      <canvas
        id="move-and-draw"
        ref={setCanvas}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={(e) => context && draw({ e, context })}
      />
    </Page>
  )
}

let hue1 = 0
let hue2 = 150
let strokeWidth = 150
let decreasing = true

const blendModes = ['screen', 'exclusion']
const blurModes = [0, 50]

export const draw = ({ e, context }) => {
  const { pageX, pageY } = e
  const x = e.clientX
  const y = e.clientY
  hue1++
  hue2++
  const sat = x / 6

  if (decreasing && strokeWidth > 75) {
    strokeWidth = strokeWidth - 2
    if (strokeWidth === 75) {
      decreasing = false
    }
  } else {
    decreasing = false
    strokeWidth = strokeWidth + 2
    if (strokeWidth === 150) {
      decreasing = true
    }
  }

  const gradient = context.createLinearGradient(x - 35, y - 35, x + 35, y + 35)
  gradient.addColorStop(0, `hsl(${hue1}, ${sat}%, 60%)`)
  gradient.addColorStop(1, `hsl(${hue2}, ${sat}%, 60%)`)
  context.fillStyle = gradient
  context.beginPath()
  context.arc(pageX, pageY, strokeWidth, 0, 2 * Math.PI)
  context.fill()
}

import React, { useEffect, useState } from 'react'
import { random } from '../lib/toolbox.js'

import { Component } from '../lib/design.js'
import { Page, Title, Instruction } from './demos.js'

const radius = 35

export const MouseTrap = () => {
  const [circles, setCircles] = useState({})
  const [box, setBox] = useState()
  const [limits, setLimits] = useState([])
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (!box) return
    const { top, right, bottom, left } = box.getBoundingClientRect()
    setLimits([top, right, bottom, left])
  }, [box, limits.length])

  useEffect(() => {
    const createCircle = ({ clientX, clientY }) => {
      setHasEntered(false)
      setCircles({
        ...circles,
        [`circle${Object.values(circles).length}`]: {
          top: clientY - radius,
          left: clientX - radius,
          color: `hsl(${random(0, 360)}, 50%, 70%)`,
          background: `radial-gradient(white 10%, transparent 60%)`,
        },
      })
    }
    document.addEventListener('click', createCircle)
    return () => document.removeEventListener('click', createCircle)
  }, [circles])

  useEffect(() => {
    const { length } = Object.values(circles)
    if (!length) return
    const moveCircle = ({ clientX, clientY }) => {
      const [top, right, bottom, left] = limits
      const insideX = clientX > left + radius && clientX < right - radius
      const insideY = clientY > top + radius && clientY < bottom - radius
      const isInside = insideX && insideY

      isInside && setHasEntered(true)

      const currentCircle = `circle${length - 1}`
      const canMoveY = (hasEntered && insideY) || !hasEntered
      const canMoveX = (hasEntered && insideX) || !hasEntered

      const color = hasEntered ? circles[currentCircle].color : 'white'
      const gradient = `radial-gradient(${color} 10%, transparent 60%)`

      setCircles({
        ...circles,
        [currentCircle]: {
          ...circles[currentCircle],
          top: (canMoveY && clientY - radius) || circles[currentCircle].top,
          left: (canMoveX && clientX - radius) || circles[currentCircle].left,
          background: gradient,
        },
      })
    }
    document.addEventListener('mousemove', moveCircle)
    return () => document.removeEventListener('mousemove', moveCircle)
  }, [circles, hasEntered, limits])

  return (
    <Page>
      <Box elemRef={setBox}>
        <Title>Mouse trap</Title>
        <Instruction>Click anywhere and move</Instruction>
      </Box>
      {Object.values(circles).map((circle, i) => (
        <Circle key={`circle-${i}`} style={{ ...circle }} />
      ))}
    </Page>
  )
}

const Box = Component.w35p.h30p.ba.bWhite.alignCenter.justifyCenter.flex.flexColumn.div()
const Circle = Component.bRad50p.absolute.bgWhite.w70.h70.div()

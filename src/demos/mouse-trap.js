import React, { useEffect, useState } from 'react'
import { Component, Div } from '../lib/design.js'

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
          top: clientY - 25,
          left: clientX - 25,
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
      const insideX = clientX > left + 25 && clientX < right - 25
      const insideY = clientY > top + 25 && clientY < bottom - 25
      const isInside = insideX && insideY

      isInside && setHasEntered(true)

      const currentCircle = `circle${length - 1}`
      const canMoveY = (hasEntered && insideY) || !hasEntered
      const canMoveX = (hasEntered && insideX) || !hasEntered

      setCircles({
        ...circles,
        [currentCircle]: {
          top: (canMoveY && clientY - 25) || circles[currentCircle].top,
          left: (canMoveX && clientX - 25) || circles[currentCircle].left,
          background: hasEntered ? 'var(--purple4)' : 'white',
        },
      })
    }
    document.addEventListener('mousemove', moveCircle)
    return () => document.removeEventListener('mousemove', moveCircle)
  }, [circles, hasEntered, limits])

  return (
    <Div alignCenter justifyCenter flex w100p h100p>
      <Box elemRef={setBox}>
        <Div heading fs100 white>
          Mouse trap
        </Div>
        <Div fs15 grey5>
          Click anywhere and move
        </Div>
      </Box>
      {Object.values(circles).map((circle, i) => (
        <Circle key={`circle-${i}`} style={{ ...circle }} />
      ))}
    </Div>
  )
}

const Box = Component.w35p.h30p.ba.bWhite.alignCenter.justifyCenter.flex.flexColumn.div()
const Circle = Component.bRad50p.absolute.bgWhite.w50.h50.div()

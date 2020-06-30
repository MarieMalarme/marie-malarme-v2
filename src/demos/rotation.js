import React, { useEffect, useState } from 'react'

import { Page, Title, Instruction } from './demos.js'
import { Component } from '../lib/design.js'

const faces = [
  { face: 'cover', rotation: 0, axis: 'Y' },
  { face: 'spine', rotation: -90, axis: 'Y' },
  { face: 'back', rotation: 180, axis: 'Y' },
  { face: 'top', rotation: 90, axis: 'X' },
  { face: 'side', rotation: 90, axis: 'Y' },
  { face: 'bottom', rotation: -90, axis: 'X' },
]

const styles = ['solid', 'translucid', 'linear', 'radial']

export const Rotation = () => {
  const [cube, setCube] = useState(null)
  const [page, setPage] = useState(null)
  const [style, setStyle] = useState(styles[0])

  document.body.style.perspective = '1500px'

  useEffect(() => {
    if (!cube || !page) return
    const rotate = ({ pageX, pageY }) => {
      const midX = pageX - window.innerWidth / 2
      const midY = pageY - window.innerHeight / 2

      cube.style.transform = `rotateX(${midY / 2}deg) rotateY(${midX}deg)`
      page.style.filter = `hue-rotate(${(pageX * 360) / window.innerHeight}deg)`
    }

    document.addEventListener('mousemove', rotate)
    return () => document.removeEventListener('mousemove', rotate)
  }, [cube, page])

  useEffect(() => {
    const changeStyle = () => {
      const current = styles.indexOf(style)
      const last = current === styles.length - 1
      const next = last ? 0 : current + 1
      setStyle(styles[next])
    }

    document.addEventListener('click', changeStyle)
    return () => document.removeEventListener('click', changeStyle)
  }, [style])

  return (
    <Page elemRef={setPage}>
      <Title>Rotation</Title>
      <Instruction>
        Move the mouse to rotate — click to change style
      </Instruction>
      <Cube
        elemRef={setCube}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {faces.map(({ face, rotation, axis }, i) => (
          <Face
            id={face}
            key={face}
            style={{
              transform: `rotate${axis}(${rotation}deg) translateZ(100px)`,
              background: getBackground(style, face, i),
              backgroundSize: '200px',
              animation:
                style === 'translucid'
                  ? 'bg-size 1s alternate linear infinite'
                  : 'bg-position 1.5s linear infinite',
            }}
          />
        ))}
      </Cube>
    </Page>
  )
}

const hsl = (hue) => `hsl(${hue}, 70%, 65%)`
const gradient = { step1: hsl(100), step2: hsl(250), step3: hsl(170) }
const { step1, step2, step3 } = gradient

const getBackground = (style, face, i) => {
  const solid = style === 'solid'
  const translucid = style === 'translucid'
  const linear = style === 'linear'
  const radial = style === 'radial'

  if (linear) {
    return (
      ((face === 'bottom' || face === 'top') && 'transparent') ||
      `linear-gradient(${step1}, ${step2}, ${step3}, ${step2}, ${step1})`
    )
  }

  if (translucid) {
    return `radial-gradient(${step1}, transparent)`
  }

  if (solid) {
    return `linear-gradient(${step1}, ${step2}, ${step3}`
  }

  if (radial) {
    return `radial-gradient(hsl(${
      (i * 360) / faces.length
    }, 70%, 65%), transparent)`
  }
}

const Cube = Component.absolute.noEvents.div()
const Face = Component.absolute.t0.l0.pa20.w200.h200.div()

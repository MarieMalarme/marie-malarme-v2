import React, { useState } from 'react'

import { toDashCase } from '../lib/toolbox.js'

import { Component, Div } from '../lib/design.js'
import { Page, Title, Instruction } from './demos.js'

const ranges = [
  { attribute: 'fontSize', min: 50, max: 150 },
  { attribute: 'letterSpacing', min: 1, max: 20 },
  { attribute: 'opacity', min: 0.1, max: 1, step: 0.01 },
]

export const HarderBiggerBolderStronger = () => {
  const [dragging, setDragging] = useState(false)
  const [style, setStyle] = useState({
    fontSize: '100px',
    letterSpacing: 1,
    opacity: 1,
  })

  return (
    <Page>
      <Title style={{ ...style }}>Harder, bigger, bolder, stronger</Title>
      <Instruction o0={dragging}>Slide to customize</Instruction>
      <Ranges style={{ bottom: '20%' }}>
        {ranges.map((range) => (
          <Range
            key={range.attribute}
            style={style}
            setStyle={setStyle}
            setDragging={setDragging}
            {...range}
          />
        ))}
      </Ranges>
    </Page>
  )
}

const Ranges = Component.flex.w50p.justifyBetween.absolute.div()

const Range = ({ style, setStyle, setDragging, attribute, ...props }) => {
  const measure = (attribute !== 'opacity' && 'px') || ''

  return (
    <Div grey5 flex flexColumn alignCenter>
      <Div mb15 fs15>
        {toDashCase(attribute)}
      </Div>
      <input
        type="range"
        defaultValue={style[attribute]}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onChange={({ target }) =>
          setStyle({
            ...style,
            [attribute]: `${target.value}${measure}`,
          })
        }
        {...props}
      />
      <Div mt15 fs15>
        {style[attribute]}
      </Div>
    </Div>
  )
}

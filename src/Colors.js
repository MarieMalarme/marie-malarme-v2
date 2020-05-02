import React from 'react'
import { Component, Div } from './lib/design.js'
import { colors } from './lib/colors.js'

export const Colors = () => (
  <Div w100p flex flexWrap>
    {colors.map(([name, value]) => (
      <Tint name={name} key={name}>
        <TintCircle value={value} />
        <TintName>{name}</TintName>
        <TintValue>
          {(value.includes('#') && value) || value.split(' ')[2].slice(0, -1)}
        </TintValue>
      </Tint>
    ))}
  </Div>
)

const Tint = ({ name, children }) => (
  <TintStyle
    key={name}
    style={{
      width: 'calc(100% / 9)',
      marginRight: `${(name === 'black' && 'calc((100% / 9 * 7))') || '0'}`,
    }}
  >
    {children}
  </TintStyle>
)

const TintCircle = ({ value }) => (
  <TintCircleStyle
    style={{
      boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)',
      background: value,
    }}
  />
)

const TintStyle = Component.alignCenter.flexColumn.mv35.flex.div()
const TintName = Component.graebenbach.mt15.div()
const TintValue = Component.graebenbach.mt5.div()
const TintCircleStyle = Component.w30.h30.bRad50p.div()

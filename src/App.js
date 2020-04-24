import React, { useState } from 'react'
import { Component, Code, Div } from './lib/design.js'
import { colors } from './lib/colors.js'
import { generated, core } from './lib/style.js'
import './App.css'

const App = () => {
  return (
    <Div pa100>
      <Flags />
      <Colors colors={colors} />
    </Div>
  )
}

const FlagWrapper = Component.bb.bGrey6.w100p.animBoxShadow.div()
const FlagTitle = Component.fs40.murmure.mr20.mb20.div()
const FlagCode = Component.pv30.ph35.bgGrey2.lh25.div()
const FlagTab = Component.flex.alignBaseline.pointer.div()

const Flag = ({ title, classes }) => {
  const [open, setOpen] = useState(false)
  return (
    <FlagWrapper className="container" mb50={open} mb25={!open}>
      <FlagTab onClick={() => setOpen(!open)}>
        <FlagTitle className="capFirst">
          {title
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase()}
        </FlagTitle>
        <Div graebenbach>{open ? '— Close' : '+ Open'}</Div>
      </FlagTab>
      {open && (
        <FlagCode>
          <Code>
            {Object.entries(classes)
              .map(([selector, rules]) => `.${selector} { ${rules}; }`)
              .join('\n')}
          </Code>
        </FlagCode>
      )}
    </FlagWrapper>
  )
}

const Flags = () => (
  <Div flex flexWrap>
    <Flag title="Core" classes={core} />
    {Object.entries(generated).map(([title, classes]) => (
      <Flag key={title} title={title} classes={classes} />
    ))}
  </Div>
)

const Colors = ({ colors }) => (
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

export default App

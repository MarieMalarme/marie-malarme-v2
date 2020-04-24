import React, { useState } from 'react'
import { Code, Div } from './lib.js'
import { colors, generated, core, Component } from './style.js'
import './App.css'

const App = () => {
  return (
    <Div pa100>
      <Flags />
      <Colors colors={colors} />
    </Div>
  )
}

const FlagTitle = Component.fs40.murmure.mr20.mb20.div()
const FlagCode = Component.pv30.ph35.div()

const Flag = ({ title, classes }) => {
  const [open, setOpen] = useState(false)
  return (
    <Div
      className="container"
      style={{
        position: 'relative',
        width: '100%',
        borderBottom: 'solid 1px var(--grey6)',
      }}
      mb50={open}
      mb25={!open}
    >
      <Div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          cursor: 'pointer',
        }}
      >
        <FlagTitle className="capFirst">
          {title
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase()}
        </FlagTitle>
        <Div graebenbach>{open ? '— Close' : '+ Open'}</Div>
      </Div>
      {open && (
        <FlagCode
          style={{
            background: 'var(--grey2)',
            lineHeight: '1.75rem',
          }}
        >
          <Code style={{ whiteSpace: 'pre-wrap' }}>
            {Object.entries(classes)
              .map(([selector, rules]) => `.${selector} { ${rules}; }`)
              .join('\n')}
          </Code>
        </FlagCode>
      )}
    </Div>
  )
}

const Flags = () => (
  <Div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}
  >
    <Flag title="Core" classes={core} />
    {Object.entries(generated).map(([title, classes]) => (
      <Flag key={title} title={title} classes={classes} />
    ))}
  </Div>
)

const Colors = ({ colors }) => (
  <Div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    {colors.map(([name, value]) => (
      <Tint name={name} key={name}>
        <TintCircle value={value} />
        <TintName name={name} />
        <TintValue value={value} />
      </Tint>
    ))}
  </Div>
)

const Tint = ({ name, children }) => (
  <Div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% / 9)',
      alignItems: 'center',
      marginRight: `${(name === 'black' && 'calc((100% / 9 * 7))') || '0'}`,
    }}
    mv35
  >
    {children}
  </Div>
)

const TintCircle = ({ value }) => (
  <Div
    style={{
      background: value,
      borderRadius: '50%',
      boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)',
    }}
    w30
    h30
  />
)

const TintName = ({ name }) => (
  <Div graebenbach mt15>
    {name}
  </Div>
)

const TintValue = ({ value }) => (
  <Div graebenbach mt5>
    {(value.includes('#') && value) || value.split(' ')[2].slice(0, -1)}
  </Div>
)

export default App

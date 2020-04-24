import React, { useState } from 'react'
import { Code, Div } from './lib.js'
import { colors, generated, core } from './style.js'
import './App.css'

const App = () => {
  return (
    <Div style={{ padding: '5rem' }}>
      <Flags />
      <Colors colors={colors} />
    </Div>
  )
}

const Flag = ({ title, classes }) => {
  const [open, setOpen] = useState(false)
  return (
    <Div
      className="container"
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: `${open ? '3rem' : '1.5rem'}`,
        borderBottom: 'solid 1px var(--grey6)',
      }}
    >
      <Div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          cursor: 'pointer',
        }}
      >
        <Div
          fs40
          murmure
          style={{
            marginRight: '20px',
            marginBottom: '20px',
          }}
          className="capFirst"
        >
          {title
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase()}
        </Div>
        <Div graebenbach>{open ? '— Close' : '+ Open'}</Div>
      </Div>
      {open && (
        <Div
          style={{
            background: 'var(--grey2)',
            padding: '1.75rem 2rem',
            lineHeight: '1.75rem',
          }}
        >
          <Code white graebenbach style={{ whiteSpace: 'pre-wrap' }}>
            {Object.entries(classes)
              .map(([selector, rules]) => `.${selector} { ${rules}; }`)
              .join('\n')}
          </Code>
        </Div>
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
      marginTop: `3rem`,
      marginBottom: `3rem`,
      marginRight: `${(name === 'black' && 'calc((100% / 9 * 7))') || '0'}`,
    }}
  >
    {children}
  </Div>
)

const TintCircle = ({ value }) => (
  <Div
    style={{
      width: '30px',
      height: '30px',
      background: value,
      borderRadius: '50%',
      boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)',
    }}
  />
)

const TintName = ({ name }) => (
  <Div graebenbach style={{ marginTop: '1rem' }}>
    {name}
  </Div>
)

const TintValue = ({ value }) => (
  <Div graebenbach style={{ marginTop: '0.4rem' }}>
    {(value.includes('#') && value) || value.split(' ')[2].slice(0, -1)}
  </Div>
)

export default App

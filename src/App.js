import React from 'react'
import { Div } from './lib.js'
import { colors } from './style.js'
import './App.css'

const App = () => {
  return <Colors colors={colors} />
}

const Colors = ({ colors }) => (
  <Div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      padding: '5rem',
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

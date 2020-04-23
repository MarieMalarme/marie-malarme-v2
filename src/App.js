import React from 'react'
import { Div } from './lib.js'
import { colors } from './style.js'
import './App.css'

const App = () => {
  return (
    <Div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        padding: '5rem',
      }}
    >
      {colors.map(([key, value]) => (
        <Div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100% / 9)',
            alignItems: 'center',
            marginTop: `3rem`,
            marginBottom: `3rem`,
            marginRight: `${(key === 'black' && 'calc((100% / 9 * 7))') ||
              '0'}`,
          }}
        >
          <Div
            style={{
              width: '30px',
              height: '30px',
              background: value,
              borderRadius: '50%',
              boxShadow: '0 0 25px rgba(0, 0, 0, 0.25)',
            }}
          />
          <Div style={{ marginTop: '1rem', fontFamily: 'monospace' }}>
            {key}
          </Div>
        </Div>
      ))}
    </Div>
  )
}

export default App

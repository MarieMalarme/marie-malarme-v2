import React, { useState, useEffect } from 'react'
import { Component, Div } from '../lib/design.js'

export const KeycodesSymphony = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const handleKey = ({ key }) => {
      if (key === 'Backspace') {
        setNotes(notes.slice(0, notes.length - 1))
        return
      } else if (key === 'Escape') {
        setNotes([])
        return
      }
      const number = key.charCodeAt(0) * 2 - 150
      const color = `hsl(270, ${number}%, ${number}%)`
      setNotes([...notes, { key, color }])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [notes])

  const empty = !notes.length

  return (
    <Notes alignCenter={empty} justifyCenter={empty}>
      {empty && Instruction}
      {notes.map(({ key, color }, i) => (
        <Note key={`key${i}`} style={{ background: color, flex: 1 }}>
          {key}
        </Note>
      ))}
    </Notes>
  )
}

const Notes = Component.flex.flexWrap.w100p.h100p.div()
const Note = Component.fs30.flex.alignCenter.justifyCenter.white.div()

const Instruction = (
  <Div flex flexColumn alignCenter justifyCenter>
    <Div white heading fs100>
      Keycodes symphony
    </Div>
    <Div fs15 grey5>
      Type something to compose
    </Div>
  </Div>
)

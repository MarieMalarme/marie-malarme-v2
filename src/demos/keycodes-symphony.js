import React, { useState, useEffect } from 'react'

import { random } from '../lib/toolbox.js'

import { Component } from '../lib/design.js'
import { Page, Title, Instruction } from './demos.js'

export const KeycodesSymphony = () => {
  const [notes, setNotes] = useState([])
  const [vertical, setVertical] = useState(true)

  const { length } = notes

  useEffect(() => {
    const handleKey = ({ key }) => {
      if (length) {
        if (key === 'Control') {
          setVertical(!vertical)
          return
        }
        if (key === 'Escape') {
          setNotes([])
          return
        }
        if (key === 'Backspace') {
          if (!length) return
          setNotes(notes.slice(0, length - 1))
          return
        }
      }

      const enter = key === 'Enter'
      const number = key.charCodeAt(0) * 2 - 150
      const saturation = (enter && 100) || (number > 0 && number) || 30
      const color = `hsl(${random(0, 360)}, ${saturation}%, 70%)`

      setNotes([
        ...notes,
        {
          color,
          key: (enter && 'Pause') || key,
          width: (enter && '100%') || '20%',
        },
      ])
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [length, vertical, notes])

  const empty = !length

  useEffect(() => {
    if (empty) return
    const notes = [...document.querySelectorAll('.note')]
    const target = notes[length - 1]
    target.scrollIntoView({ behavior: 'smooth' })
  }, [length, empty])

  return (
    <Notes flexColumn={vertical} alignCenter={empty} justifyCenter={empty}>
      {empty && (
        <Page>
          <Title>Keycodes symphony</Title>
          <Instruction>
            Type to compose — Press Ctrl to change orientation
          </Instruction>
        </Page>
      )}
      {notes.map(({ key, color, width, first }, i) => {
        return (
          <Note
            className="note"
            key={`key${i}`}
            style={{
              background: color,
              flex: `1 1 ${width}`,
              minHeight: '100px',
            }}
          >
            {key}
          </Note>
        )
      })}
    </Notes>
  )
}

const Notes = Component.flex.flexWrap.w100p.h100p.div()
const Note = Component.fs30.flex.alignCenter.justifyCenter.white.pa15.div()

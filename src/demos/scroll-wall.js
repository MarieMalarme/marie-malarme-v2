import React, { useState, useEffect } from 'react'
import { random } from '../lib/toolbox.js'

import { Component } from '../lib/design.js'
import { Title, Instruction } from './demos.js'

const diameter = 100
const radius = diameter / 2

export const ScrollWall = () => {
  const [[mouseX, mouseY], setMouse] = useState([])
  const [lastScroll, setLastScroll] = useState(0)

  const [lines, setLines] = useState([])
  const [empty, setEmpty] = useState(false)
  const [color, setColor] = useState(`hsl(${random(0, 360)}, 50%, 50%)`)

  const [scroller, setScroller] = useState(null)
  const [scrolled, setScrolled] = useState('101vh')
  const [guide, setGuide] = useState(null)

  useEffect(() => {
    if (!guide) return

    const updateColor = () => {
      setColor(`hsl(${random(0, 360)}, 50%, 50%)`)
    }

    document.addEventListener('click', updateColor)
    return () => document.removeEventListener('click', updateColor)
  }, [guide])

  useEffect(() => {
    if (!guide) return

    const getCoords = ({ pageX, pageY, clientX, clientY }) => {
      setMouse([pageX, pageY])
      guide.style.top = `${scroller.scrollTop + pageY - radius}px`
      guide.style.left = `${pageX - radius}px`
      guide.style.display = `block`
    }

    document.addEventListener('mousemove', getCoords)
    return () => document.removeEventListener('mousemove', getCoords)
  }, [guide, scroller])

  useEffect(() => {
    if (!scroller || !guide) return

    const scrollerTop = scroller.scrollTop

    const paint = ({ target }) => {
      const up = lastScroll > target.scrollTop
      if (!up) {
        const distance = target.scrollTop - scrollerTop
        setLines([
          ...lines,
          {
            top: `${mouseY - radius + scrollerTop}px`,
            left: `${mouseX - radius}px`,
            height: `${distance + radius}px`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          },
        ])

        const { height } = scrolled.getBoundingClientRect()
        scrolled.style.height = `${height + 10}px`
      }
      setLastScroll(target.scrollTop)
      guide.style.display = 'none'
    }

    scroller.addEventListener('scroll', paint)
    return () => scroller.removeEventListener('scroll', paint)
  }, [scroller, mouseX, mouseY, scrolled, color, guide, empty])

  useEffect(() => {
    if (!empty) return
    setLines([])
    setTimeout(() => setEmpty(false), 50)
  }, [empty])

  useEffect(() => {
    const clear = ({ key }) => {
      if (key !== 'Escape') return
      setEmpty(true)
    }

    document.addEventListener('keydown', clear)
    return () => document.removeEventListener('keydown', clear)
  })

  return (
    <Scroller elemRef={setScroller}>
      <Text>
        <Title>Scroll wall</Title>
        <Instruction>
          Position the mouse to begin — Scroll to paint & click to change color
        </Instruction>
      </Text>
      <Scrolled elemRef={setScrolled} style={{ height: scrolled }} />
      <Guide elemRef={setGuide} style={{ background: color }} />
      {lines.map((line, i) => (
        <Line
          key={`line-${i}`}
          style={{
            ...line,
            borderRadius: `${diameter}px`,
            minHeight: `${diameter}px`,
            width: `${diameter}px`,
          }}
        />
      ))}
    </Scroller>
  )
}

const Scroller = Component.w100p.h100vh.fixed.ofScroll.div()
const Text = Component.w100p.h100vh.flex.flexColumn.justifyCenter.alignCenter.div()
const Scrolled = Component.relative.w100p.div()
const Guide = Component.absolute.w100.h100.bgBlue6.bRad50p.div()
const Line = Component.absolute.div()

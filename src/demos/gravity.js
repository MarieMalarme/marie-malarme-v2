import React, { useState, useEffect } from 'react'
import { Body, Engine, Render, World, Bodies } from 'matter-js'

import { random } from '../lib/toolbox.js'

import { Div } from '../lib/design.js'
import { Page, Title, Instruction } from './demos.js'

// TO DO: resize canvas on window resize:
// change the render > options > width & height + change the walls' positions & dimensions

const w = window.innerWidth
const h = window.innerHeight

const up = { x: w / 2, w, h: 100 }
const side = { y: h / 2, w: 100, h }

const walls = {
  ground: { ...up, y: h + 50 },
  ceiling: { ...up, y: -50 },
  left: { ...side, x: -50 },
  right: { ...side, x: w + 50 },
}

export const Gravity = ({ tabs }) => {
  const [canvas, setCanvas] = useState(null)
  const [engine, setEngine] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setEngine(Engine.create())
  }, [])

  useEffect(() => {
    if (!engine) return

    const render = Render.create({
      element: canvas,
      engine,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: 'transparent',
      },
    })

    engine.world.gravity.y = 5

    Object.values(walls).map(({ x, y, w, h }) => {
      const wall = Bodies.rectangle(x, y, w, h, { isStatic: true, density: 1 })
      World.add(engine.world, wall)
      return World
    })

    const createShape = (x, y, i) => {
      const shape = Bodies.circle(x, y, 10, {
        render: {
          fillStyle: `hsl(${random(0, 360)}, 90%, 70%)`,
          id: `circle-${i}`,
        },
      })
      World.add(engine.world, shape)
    }

    const arr = [...Array(300).keys()]
    arr.map((i) => createShape(random(0, w), random(0, h), i))

    Engine.run(engine)
    Render.run(render)
  }, [engine, canvas])

  useEffect(() => {
    if (!engine) return

    const changeGravity = (e) => {
      const scale = 4
      const randomPos = random(-scale / 2, scale / 2)
      const x = (e && getPos(e.clientX, w, scale)) || randomPos
      const y = (e && getPos(e.clientY, h, scale)) || randomPos

      engine.world.gravity.x = x
      engine.world.gravity.y = y
    }

    document.addEventListener('mousemove', changeGravity)
    return () => document.removeEventListener('mousemove', changeGravity)
  }, [engine])

  useEffect(() => {
    const increase = () => {
      setCount(count + 1)
    }
    document.addEventListener('click', increase)
    return () => document.removeEventListener('click', increase)
  })

  useEffect(() => {
    count === 6 && setCount(0)
  }, [count])

  useEffect(() => {
    if (!engine) return

    const changeColors = () => {
      const circles = engine.world.bodies.filter(
        (b) => b.label === 'Circle Body',
      )
      const scale = count < 3 ? 2 : 0.5
      circles.map((circle) => {
        Body.scale(circle, scale, scale)
        return Body
      })
    }

    document.addEventListener('click', changeColors)
    return () => document.removeEventListener('click', changeColors)
  }, [engine, count])

  useEffect(() => {
    if (!tabs || !engine) return

    const clearWorld = () => World.clear(engine.world)

    const otherTabs = [...tabs.children].filter(
      (t) => t.textContent !== 'gravity',
    )

    otherTabs.forEach((tab) => tab.addEventListener('click', clearWorld))
    return () =>
      otherTabs.forEach((tab) => tab.removeEventListener('click', clearWorld))
  }, [tabs, engine])

  return (
    <Page>
      <Title>Gravity</Title>
      <Instruction>Move to affect the gravity — click to expand</Instruction>
      <Div fixed id="gravity" elemRef={setCanvas} />
    </Page>
  )
}

const getPos = (pos, max, scale) => (pos / max) * scale - scale / 2

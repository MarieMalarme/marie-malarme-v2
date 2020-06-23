import React, { useState } from 'react'
import { Component, Div } from './lib/design.js'

import { MoveAndDraw } from './demos/move-and-draw.js'
import { KeycodesSymphony } from './demos/keycodes-symphony.js'
import { MouseTrap } from './demos/mouse-trap.js'
import { PickAndClick } from './demos/pick-and-click.js'
import { HarderBiggerBolderStronger } from './demos/harder-bigger-bolder-stronger.js'

const demos = [
  {
    name: 'move-and-draw',
    comp: MoveAndDraw,
  },
  {
    name: 'keycodes-symphony',
    comp: KeycodesSymphony,
  },
  {
    name: 'mouse-trap',
    comp: MouseTrap,
  },
  {
    name: 'pick-and-click',
    comp: PickAndClick,
  },
  {
    name: 'harder-bigger-bolder-stronger',
    comp: HarderBiggerBolderStronger,
  },
]

export const Playground = () => {
  const [currentDemo, setCurrentDemo] = useState(demos[0])
  const Demo = currentDemo.comp
  return (
    <Div w100vw h100vh bgGrey1>
      <Tabs currentDemo={currentDemo} setCurrentDemo={setCurrentDemo} />
      <Demo />
    </Div>
  )
}

const Tabs = ({ currentDemo, setCurrentDemo }) => (
  <TabsBar>
    {demos.map((demo) => (
      <Tab
        onClick={() => setCurrentDemo(demo)}
        key={demo.name}
        bb={currentDemo.name === demo.name}
      >
        {demo.name}
      </Tab>
    ))}
  </TabsBar>
)

const TabsBar = Component.fixed.flex.w100p.justifyBetween.pv50.ph60.zi5.div()
const Tab = Component.pointer.bWhite.pb5.white.div()

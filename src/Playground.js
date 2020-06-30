import React, { useState } from 'react'
import { Component, Div } from './lib/design.js'

import { MoveAndDraw } from './demos/move-and-draw.js'
import { KeycodesSymphony } from './demos/keycodes-symphony.js'
import { MouseTrap } from './demos/mouse-trap.js'
import { PickAndClick } from './demos/pick-and-click.js'
import { HarderBiggerBolderStronger } from './demos/harder-bigger-bolder-stronger.js'
import { Gravity } from './demos/gravity.js'
import { KeyboardPainting } from './demos/keyboard-painting.js'
import { ScrollWall } from './demos/scroll-wall.js'
import { Rotation } from './demos/rotation.js'

const demos = [
  {
    name: 'rotation',
    comp: Rotation,
  },
  {
    name: 'scroll-wall',
    comp: ScrollWall,
  },
  {
    name: 'keyboard-painting',
    comp: KeyboardPainting,
  },
  {
    name: 'keycodes-symphony',
    comp: KeycodesSymphony,
  },
  {
    name: 'gravity',
    comp: Gravity,
  },
  {
    name: 'pick-and-click',
    comp: PickAndClick,
  },
  {
    name: 'move-and-draw',
    comp: MoveAndDraw,
  },
  {
    name: 'mouse-trap',
    comp: MouseTrap,
  },
  {
    name: 'harder-bigger-bolder-stronger',
    comp: HarderBiggerBolderStronger,
  },
]

export const Playground = () => {
  const [currentDemo, setCurrentDemo] = useState(demos[0])
  const [tabs, setTabs] = useState(null)
  const Demo = currentDemo.comp
  return (
    <Div w100vw h100vh bgGrey1>
      <Tabs
        elemRef={setTabs}
        currentDemo={currentDemo}
        setCurrentDemo={setCurrentDemo}
      />
      <Demo tabs={tabs} />
    </Div>
  )
}

const Tabs = ({ currentDemo, setCurrentDemo, ...props }) => (
  <TabsBar {...props}>
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

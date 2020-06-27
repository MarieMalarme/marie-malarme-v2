import React from 'react'
import { Component, Div } from '../lib/design.js'

export const Page = Component.flex.alignCenter.justifyCenter.flexColumn.w100vw.h100vh.div()
export const Title = Component.white.heading.fs100.div()
export const Instruction = Component.fs15.grey5.div()

export const Mode = ({ caption, onClick, selected, clear }) => (
  <Control onClick={onClick}>
    <Dot bgGrey2={!clear} bgWhite={clear} />
    <Div pb5 bGrey3={!clear} bWhite={clear} white={clear} bb={selected}>
      {caption}
    </Div>
  </Control>
)

const Control = Component.pointer.noSelect.flex.flexColumn.alignCenter.textCenter.w100.div()
const Dot = Component.w10.h10.mb15.bRad50p.div()

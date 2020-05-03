import React, { useState } from 'react'
import { Component, Code, Div } from './lib/design.js'
import { generated, core } from './lib/style.js'

export const Flags = () => (
  <Div flex flexWrap>
    <Flag title="Core" classes={core} />
    {Object.entries(generated).map(([title, classes]) => (
      <Flag key={title} title={title} classes={classes} />
    ))}
  </Div>
)

const Flag = ({ title, classes }) => {
  const [open, setOpen] = useState(false)
  return (
    <FlagWrapper className="container" mb50={open} mb25={!open}>
      <FlagTab onClick={() => setOpen(!open)}>
        <FlagTitle className="capFirst">
          {title
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase()}
        </FlagTitle>
        <Div>{open ? '— Close' : '+ Open'}</Div>
      </FlagTab>
      {open && (
        <FlagCode>
          <Code>
            {Object.entries(classes)
              .map(([selector, rules]) => `.${selector} { ${rules}; }`)
              .join('\n')}
          </Code>
        </FlagCode>
      )}
    </FlagWrapper>
  )
}

const FlagWrapper = Component.bb.bGrey6.w100p.animBoxShadow.div()
const FlagTitle = Component.fs40.heading.mr20.mb20.div()
const FlagCode = Component.pv30.ph35.bgGrey2.lh25.div()
const FlagTab = Component.flex.alignBaseline.pointer.div()

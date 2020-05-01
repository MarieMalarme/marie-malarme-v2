import React, { useState, useEffect } from 'react'
import { Component, Div } from './lib/design.js'

export const Project = ({ target }) => {
  const [project, setProject] = useState(target.current)

  useEffect(() => {
    window.addEventListener(
      'click',
      () => target.current && setProject(target.current),
    )
  })

  if (!project) return null

  return (
    <Modale relative>
      <Div
        fs40
        absolute
        style={{ right: 100, top: 100 }}
        pointer
        onMouseUp={() => setProject()}
      >
        ×
      </Div>
      <Div murmure heading mb70>
        {project.name}
      </Div>
      <Div fs30 wsPreLine>
        {project.content}
      </Div>
    </Modale>
  )
}

const Modale = Component.fixed.w100p.h100vh.pa100.bgWhite.div()

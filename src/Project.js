import React, { useState, useEffect } from 'react'
import { Component, Div } from './lib/design.js'
import { projects } from './projects.data.js'

export const Project = ({ target }) => {
  const [project, setProject] = useState(target.current)

  useEffect(() => {
    window.addEventListener(
      'click',
      () => target.current && setProject(target.current),
    )
  })

  if (!project) return null

  const selectedProject = projects.find(({ name }) => name === project.name)

  return (
    <Modale style={{ overflowY: 'scroll' }}>
      <Div
        fs40
        fixed
        style={{ right: 100, top: 100 }}
        pointer
        onMouseUp={() => {
          setProject()
          target.current.modale = false
        }}
      >
        ×
      </Div>
      <Div heading fs100 mb70>
        {selectedProject.name}
      </Div>
      <Div style={{ fontSize: '50px', lineHeight: '75px' }} wsPreLine lh50>
        {selectedProject.content}
      </Div>
    </Modale>
  )
}

const Modale = Component.fixed.w100p.h100vh.ph150.pv140.bgWhite.div()

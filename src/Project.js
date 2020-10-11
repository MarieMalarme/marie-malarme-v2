import React, { useState, useEffect } from 'react'
import { Component, Div } from './lib/design.js'
import { projects } from './projects.data.js'

export const Project = ({ project, setProject }) => {
  if (!project || !project.modale) return null
  const selectedProject = projects.find(({ name }) => name === project.name)

  return (
    <Modale className="fadeInFast" style={{ overflowY: 'scroll' }} id="modale">
      <Close style={{ right: 100, top: 100 }} onMouseUp={() => setProject()}>
        ×
      </Close>
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
const Close = Component.fs40.fixed.pointer.div()

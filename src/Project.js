import React, { useState, useEffect } from 'react'

import { Component, Div } from './lib/design.js'
import { getProjectKey } from './lib/toolbox.js'

export const Project = ({ project, setProject }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      setProject()
      setOpen(false)
    })
  })
  if (!project || !project.modale) return null
  const { visuals, description, name } = project
  const projectKey = getProjectKey(name)

  return (
    <Modale className="fadeInFast" style={{ overflowY: 'scroll' }} id="modale">
      <Close
        style={{ right: 100, top: 100 }}
        onMouseUp={() => {
          setProject()
          setOpen(false)
        }}
      >
        ×
      </Close>
      <Visual projectKey={projectKey} extension={visuals.intro} type="intro" />
      <Div ph150 pv140>
        <Div style={{ fontSize: '48px', lineHeight: '75px' }} wsPreLine lh50>
          {description.main}
        </Div>
        <Div
          style={{ fontSize: '48px', lineHeight: '75px' }}
          wsPreLine
          lh50
          grey6
          mt50
          onClick={() => setOpen(!open)}
        >
          {open ? description.secondary : 'Read more +'}
        </Div>
      </Div>
      {visuals.slides.map((extension, i) => (
        <Visual
          key={`${projectKey}-slide-${i + 1}`}
          projectKey={projectKey}
          extension={extension}
          i={i}
        />
      ))}
    </Modale>
  )
}

const Visual = ({ extension, projectKey, type, i }) => {
  const video = extension === 'mp4'
  const suffix = type || `slide_${i + 1}`
  const fileName = `/img/${projectKey}/${projectKey}-${suffix}`
  const intro = type === 'intro'

  if (video) {
    return (
      <Div w100vw style={{ height: intro ? '100vh' : 'auto' }}>
        <video
          src={`${fileName}.mp4`}
          style={{ objectFit: 'cover' }}
          type="video/mov"
          autoPlay={true}
          width="100%"
          height="100%"
          loop={true}
        />
      </Div>
    )
  }

  return (
    <Image
      h100vh={intro}
      style={{ objectFit: 'cover', height: intro ? '100vh' : 'auto' }}
      src={`${fileName}.${extension}`}
    />
  )
}

const Modale = Component.fixed.w100p.h100vh.bgGrey1.grey8.div()
const Close = Component.fs40.fixed.zi20.pointer.div()
const Image = Component.w100p.img()

import React, { Fragment, useEffect, useState } from 'react'
import { Router } from '@reach/router'

import { Component, Div } from './lib/design.js'

import { Projects } from './Projects.js'
import { Project } from './Project.js'
import { Flags } from './Flags.js'
import { Colors } from './Colors.js'
import { Playground } from './Playground.js'

import './App.css'

import { projects } from './projects.data.js'

const App = () => (
  <Fragment>
    <Navigation />
    <Router>
      <Home path="/" />
      <Doc path="/doc" />
      <About path="/about" />
      <Playground path="/playground" />
    </Router>
  </Fragment>
)

const Home = () => {
  const [project, setProject] = useState(null)
  useEffect(() => preloadImages)

  return (
    <Div>
      <Intro />
      <Background project={project} setProject={setProject} />
      <Projects setProject={setProject} />
      <Project project={project} setProject={setProject} />
    </Div>
  )
}

const Background = ({ project, setProject }) => {
  if (!project) return null

  const selectedProject = projects.find(({ name }) => name === project.name)
  const url = imgURL(selectedProject.img)

  return (
    <Div
      className="fadeIn"
      w100vw
      h100vh
      fixed
      style={{
        background: `center / cover url(${url})`,
      }}
    />
  )
}

const Intro = () => (
  <IntroText style={{ lineHeight: '120px' }}>
    Hello! I'm a French Programming designer who loves to create any kind of
    visual stuff with technology.
  </IntroText>
)

const Doc = () => (
  <Div pa100>
    <Div fs100 heading mb40>
      Documentation
    </Div>
    <Div mb100 lh24>
      A dedicated design library has been set up to style React components in a
      flexible and elegant way.
      <br />
      CSS classes are dynamically generated in JS, and can be passed as flags to
      the React components.
    </Div>
    <Flags />
    <Colors />
  </Div>
)

const About = () => (
  <Div pa100>
    <Div fs100 heading mb40>
      About
    </Div>
  </Div>
)

const Navigation = () => (
  <NavigationWrapper>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/doc">Doc</Link>
    <Link href="/playground">Playground</Link>
  </NavigationWrapper>
)

const preloadImages = () => {
  projects.forEach((p) => {
    const image = new Image()
    image.src = imgURL(p.img)
  })
}

const imgURL = (img) =>
  `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${img}`

const NavigationWrapper = Component.zi5.pointer.fixed.b0.r0.mb40.mr50.flex.alignCenter.div()
const Link = Component.fs20.noDecoration.mono.grey2.ml30.a()
const IntroText = Component.quote.fs100.fixed.textCenter.flex.alignCenter.w100p.h100vh.l0.t0.grey9.ph100.div()

export default App

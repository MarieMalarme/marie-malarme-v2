import React, { Fragment, useRef, useEffect, useState } from 'react'
import { Router } from '@reach/router'

import { Component, Div } from './lib/design.js'

import { Projects } from './Projects.js'
import { Project } from './Project.js'
import { Flags } from './Flags.js'
import { Colors } from './Colors.js'

import './App.css'

const App = () => {
  return (
    <Fragment>
      <Navigation />
      <Router>
        <Home path="/" />
        <Doc path="/doc" />
        <About path="/about" />
      </Router>
    </Fragment>
  )
}

const Home = () => {
  const target = useRef()

  return (
    <Div>
      <Intro />
      <Background target={target} />
      <Projects target={target} />
      <Project target={target} />
    </Div>
  )
}

const Background = ({ target }) => {
  const [project, setProject] = useState(target.current)

  useEffect(() => {
    if (project) return
    document.addEventListener('mousemove', () => {
      setProject(target.current || undefined)
    })
    document.addEventListener('wheel', () => {
      setProject(target.current || undefined)
    })
  })

  if (!project) return null

  const url = `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${project.img}`

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
    Marie Malarme is a Programming designer who loves to create any kind of
    visual stuff with technology.
  </IntroText>
)

const IntroText = Component.fs100.fixed.textCenter.flex.alignCenter.w100p.h100vh.l0.t0.grey7.ph100.div()

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
  </NavigationWrapper>
)

const NavigationWrapper = Component.zi5.pointer.fixed.b0.r0.mb40.mr50.flex.alignCenter.div()
const Link = Component.fs20.noDecoration.mono.grey2.ml30.a()

export default App

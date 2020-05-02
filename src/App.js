import React, { Fragment, useRef } from 'react'
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
      <Projects target={target} />
      <Project target={target} />
    </Div>
  )
}

const Intro = () => (
  <Div fixed l0 b0 mb40 ml50 fs15 lh25>
    <Div>Marie Malarme</Div>
    <Div>Programming designer</Div>
  </Div>
)

const Doc = () => (
  <Div pa100>
    <Div heading murmure mb40>
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
    <Div heading murmure mb40>
      About
    </Div>
  </Div>
)

const Navigation = () => (
  <NavigationWrapper style={{ zIndex: 5 }}>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/doc">Doc</Link>
  </NavigationWrapper>
)

const NavigationWrapper = Component.pointer.fixed.b0.r0.mb40.mr50.flex.flexColumn.alignFlexEnd.div()
const Link = Component.fs15.lh25.noDecoration.black.a()

export default App

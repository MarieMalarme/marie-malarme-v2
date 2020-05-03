import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { projects } from './projects.data.js'

const preload = () => {
  const head = document.getElementsByTagName('head')[0]
  projects.map((p) => {
    const link = document.createElement('link')
    link.href = `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${p.img}`
    link.rel = 'prefetch'
    link.as = 'image'
    link.crossorigin = 'anonymous'
    head.appendChild(link)
    return link
  })
}

preload()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

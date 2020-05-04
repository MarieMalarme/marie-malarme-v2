import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { projects } from './projects.data.js'

const head = document.getElementsByTagName('head')[0]
const store = document.getElementById('store')
store.style.display = 'none'

const preload = () => {
  projects.map((p) => {
    const link = document.createElement('link')
    link.href = `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${p.img}`
    link.rel = 'preload'
    link.as = 'image'
    head.appendChild(link)
    const img = document.createElement('img')
    img.src = link.href
    store.appendChild(img)
    return img
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

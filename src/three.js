import React, { useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh as SetMesh,
} from 'three'
import { Div, Component } from './lib/design.js'
import { generateId } from './lib/toolbox.js'

export const Three = () => {
  return (
    <Canvas>
      <Mesh
        rotation={{ x: 1, y: 2, z: 3 }}
        position={{ x: 10, y: 20, z: 10 }}
        name="box"
      />
    </Canvas>
  )
}

export const Canvas = ({ children = [] }) => {
  const meshes = useRef()
  const ref = useRef()

  const scene = new Scene()
  const ratio = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(70, ratio, 0.1, 500)
  camera.position.set(0, 3, 75)
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearAlpha(0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  children = Array.isArray(children) ? children : [children]
  const childrenUpdated = children.map((child) => ({
    ...child,
    props: { ...child.props, meshes },
  }))

  const animate = () => {
    requestAnimationFrame(animate)
    const targets = Object.values(meshes.current)
    targets.map((target) => {
      target.rotation.x += 0.01
      target.rotation.y += 0.01
      return target
    })
    renderer.render(scene, camera)
  }

  const hasChildren = children.length

  useEffect(() => {
    if (!hasChildren) return
    Object.values(meshes.current).map((m) => scene.add(m))
    animate()
    ref.current.appendChild(renderer.domElement)
  })

  if (!hasChildren) return <EmptyCanvas />

  return <CanvasWrapper reference={ref}>{childrenUpdated}</CanvasWrapper>
}

const CanvasWrapper = ({ reference, children }) => (
  <div ref={reference}>{children}</div>
)

const EmptyCanvasWrapper = Component.lh28.pa100.flex.flexColumn.alignCenter.justifyCenter.bgGrey1.white.div()
const EmptyCanvas = ({ ref }) => (
  <EmptyCanvasWrapper>
    <Div>Nothing yet in your canvas !</Div>
    <Div>To start, add a component {`<Mesh />`}</Div>
  </EmptyCanvasWrapper>
)

const boxGeometry = new BoxGeometry(15, 15, 15)
const normalMaterial = new MeshNormalMaterial()

const coords = { x: 0, y: 0, z: 0 }

export const Mesh = ({
  meshes,
  name,
  geometry,
  material,
  position = coords,
  rotation = coords,
  ...props
}) => {
  const geo = geometry || boxGeometry
  const mat = material || normalMaterial
  const shape = new SetMesh(geo, mat)
  const { x: px, y: py, z: pz } = position
  const { x: rx, y: ry, z: rz } = rotation
  shape.position.set(px, py, pz)
  shape.rotation.set(rx, ry, rz)
  shape.name = name || generateId()

  const mesh = Object.assign(shape, props)

  meshes.current = { ...meshes.current, [mesh.name]: mesh }

  return null
}

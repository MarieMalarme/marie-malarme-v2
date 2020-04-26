import React, { Fragment, useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh as SetMesh,
  SpotLight as SetSpotLight,
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
        material="phong"
      >
        <Geometry />
      </Mesh>
      <SpotLight position={{ x: -40, y: -50, z: 50 }} />
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
    const targets = Object.values(meshes.current).filter(
      (m) => m.type === 'Mesh',
    )
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

// different types of geometry
const planeGeometry = new PlaneGeometry(15, 15, 15)
const boxGeometry = new BoxGeometry(15, 15, 15)
const sphereGeometry = new SphereGeometry(15, 15, 15)

// different types of material
const normalMaterial = new MeshNormalMaterial()
const basicMaterial = new MeshBasicMaterial({ color: 0x55ffff })
const phongMaterial = new MeshPhongMaterial({ color: 0x55ffff })

const coords = { x: 0, y: 0, z: 0 }

export const SpotLight = ({ meshes, name, position = coords, ...props }) => {
  const { x: px, y: py, z: pz } = position
  const spotLight = new SetSpotLight(0xffffff)
  spotLight.position.set(px, py, pz)
  spotLight.name = name || `spotlight-${generateId()}`
  spotLight.castShadow = true
  meshes.current = {
    ...meshes.current,
    [spotLight.name]: Object.assign(spotLight, props),
  }
  return null
}

const Geometry = ({ meshProps, geometry = boxGeometry }) => {
  const geo =
    (geometry === 'cube' && boxGeometry) ||
    (geometry === 'sphere' && sphereGeometry) ||
    geometry
  meshProps.current = { ...meshProps.current, geometry: geo }
  return null
}

export const Mesh = ({
  meshes,
  name,
  material = normalMaterial,
  color = 0xad03fc,
  position = coords,
  rotation = coords,
  shadow = true,
  children = [],
  ...props
}) => {
  const meshProps = useRef({})

  children = Array.isArray(children) ? children : [children]
  const childrenUpdated = children.map((child) => ({
    ...child,
    props: { ...child.props, meshProps },
  }))

  const mat =
    (material === 'phong' && phongMaterial) ||
    (material === 'normal' && normalMaterial) ||
    (material === 'basic' && basicMaterial) ||
    material
  mat.color.setHex(color)

  useEffect(() => {
    const geo = meshProps.current.geometry

    const shape = new SetMesh(geo, mat)
    shape.name = name || `mesh-${generateId()}`

    const { x: px, y: py, z: pz } = position
    const { x: rx, y: ry, z: rz } = rotation
    shape.position.set(px, py, pz)
    shape.rotation.set(rx, ry, rz)

    shape.receiveShadow = shadow

    const mesh = Object.assign(shape, props)

    meshes.current = { ...meshes.current, [mesh.name]: mesh }
  })

  return <Fragment>{childrenUpdated}</Fragment>
}

import React, { Fragment, useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  TextGeometry,
  FontLoader,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh as SetMesh,
  SpotLight as SetSpotLight,
} from 'three'
import { Div, Component } from './lib/design.js'
import { flatten, generateId } from './lib/toolbox.js'
import Murmure from './fonts/Murmure.json'

export const Three = () => {
  return (
    <Canvas>
      {projects.map((p, i) => (
        <Fragment key={p.name}>
          <ProjectText key={`${p.name}-text`} project={p} i={i} />
          <ProjectImage key={`${p.name}-img`} project={p} i={i} />
        </Fragment>
      ))}
    </Canvas>
  )
}

const ProjectText = ({ project, i, ...props }) => (
  <Mesh
    animate={i === 0}
    key={`mesh${i + 3}`}
    name={`project-${i + 1}`}
    position={{ x: 0, y: 0, z: 5 - i * 100 }}
    {...props}
  >
    <Text center text={project.name} size={20} depth={10} />
    <Material type="normal" />
  </Mesh>
)

const ProjectImage = ({ project, i, ...props }) => (
  <Mesh {...props}>
    <Geometry type="plane" />
    <Material />
  </Mesh>
)

const projects = [
  { name: 'Zone 01', img: '01-thumbnail.jpg' },
  { name: 'Atelier Rusch', img: 'atelier-rusch-thumbnailImage.png' },
  { name: 'Mikme', img: 'mikme-thumbnailImage.png' },
  { name: 'La Gaité nomade', img: 'gaite-nomade-thumbnailImage.jpg' },
  { name: 'Opéra comique', img: 'opera-comique-modaleIntroImage.jpg' },
  { name: 'Créations & Patrimoines', img: 'c-p-thumbnailImage.jpg' },
  { name: 'The Peacock Society', img: 'peacock-thumbnailImage.jpg' },
  { name: 'Plastik', img: 'plastik-thumbnailImage.jpg' },
  { name: 'Kikoo Docteur', img: 'kikoo-docteur-thumbnailImage.jpg' },
  { name: 'Laissez-nous loler!', img: 'laissez-nous-loler-thumbnailImage.jpg' },
]

export const Canvas = ({ children = [] }) => {
  const meshes = useRef()
  const ref = useRef()

  const scene = new Scene()
  const ratio = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(70, ratio, 0.1, 500)
  camera.position.set(0, 50, 75)
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearAlpha(0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  children = flatten(children)
  const childrenUpdated = children.map((child) => ({
    ...child,
    props: { ...child.props, meshes },
  }))

  const animate = () => {
    requestAnimationFrame(animate)
    const targets = Object.values(meshes.current).filter((m) => m.animate)
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
const plane = new PlaneGeometry(15, 15, 15)
const box = new BoxGeometry(15, 15, 15)
const sphere = new SphereGeometry(15, 15, 15)

// different types of material
const normalMaterial = new MeshNormalMaterial()
const basicMaterial = new MeshBasicMaterial({ color: 0x55ffff })
const phongMaterial = new MeshPhongMaterial({ color: 0x55ffff })

const coords = { x: 0, y: 0, z: 0 }

export const SpotLight = ({
  meshes,
  name,
  color = 'white',
  position = coords,
  ...props
}) => {
  const { x, y, z } = position
  const spotLight = new SetSpotLight(color)
  spotLight.position.set(x, y, z)
  spotLight.name = name || `spotlight-${generateId()}`
  spotLight.castShadow = true
  meshes.current = {
    ...meshes.current,
    [spotLight.name]: Object.assign(spotLight, props),
  }
  return null
}

const Geometry = ({ meshProps, type = box, ...props }) => {
  const geometry =
    (type === 'plane' && plane) ||
    (type === 'cube' && box) ||
    (type === 'sphere' && sphere) ||
    type
  meshProps.current = {
    ...meshProps.current,
    geometry: Object.assign(geometry, props),
  }
  return null
}

const Text = ({
  meshProps,
  text = 'kikoo',
  size = 10,
  depth = 5,
  typeface = Murmure,
  center,
  ...props
}) => {
  const loader = new FontLoader()
  const font = loader.parse(typeface)
  const geometry = new TextGeometry(text, {
    font,
    size,
    height: depth,
    ...props,
  })

  center && geometry.center()

  meshProps.current = {
    ...meshProps.current,
    geometry,
  }
  return null
}

const Material = ({
  meshProps,
  type = 'normal',
  color = 'lightblue',
  ...props
}) => {
  const material =
    (type === 'phong' && phongMaterial) ||
    (type === 'normal' && normalMaterial) ||
    (type === 'basic' && basicMaterial) ||
    type

  type !== 'normal' && material.color.set(color)

  meshProps.current = {
    ...meshProps.current,
    material: Object.assign(material, props),
  }
  return null
}

export const Mesh = ({
  meshes,
  name,
  position = coords,
  rotation = coords,
  shadow = true,
  center,
  animate,
  children = [],
  ...props
}) => {
  const meshProps = useRef({})

  children = Array.isArray(children) ? children : [children]
  const childrenUpdated = children.map((child) => ({
    ...child,
    props: { ...child.props, meshProps },
  }))

  useEffect(() => {
    const geo = meshProps.current.geometry || box
    const mat = meshProps.current.material || normalMaterial

    const mesh = new SetMesh(geo, mat)
    mesh.name = name || `mesh-${generateId()}`

    const { x: px, y: py, z: pz } = position
    const { x: rx, y: ry, z: rz } = rotation
    mesh.position.set(px, py, pz)
    mesh.rotation.set(rx, ry, rz)

    mesh.receiveShadow = shadow

    meshes.current = {
      ...meshes.current,
      [mesh.name]: Object.assign(mesh, props, { animate }),
    }
  })

  return <Fragment>{childrenUpdated}</Fragment>
}

import React, { Fragment, useEffect, useState, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  TextGeometry,
  FontLoader,
  DoubleSide,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshPhongMaterial,
  TextureLoader,
  Raycaster,
  Vector2,
  Mesh as SetMesh,
  Group as SetGroup,
  AmbientLight,
  DirectionalLight,
  SpotLight,
} from 'three'
import { Div, Component } from './design.js'
import { flatten, reduce, generateId, findByProp } from './toolbox.js'
import { events } from './events.js'
import Murmure from '../fonts/Murmure.json'

export const Canvas = ({ children = [], ...props }) => {
  const mouseCoords = useRef()

  const meshes = useRef()
  const [ref, setRef] = useState(null)

  const scene = new Scene()
  const ratio = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(70, ratio, 1, 600)
  camera.position.set(0, 0, 75)
  camera.lookAt(scene.position)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearAlpha(0)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const raycaster = new Raycaster()

  const mouse = new Vector2()

  const updatedChildren = flatten(children).map((child) => ({
    ...child,
    props: { ...child.props, meshes, scene, camera },
  }))

  const animateScene = () => {
    requestAnimationFrame(animateScene)

    if (mouseCoords.current) {
      mouse.x = (mouseCoords.current.x / window.innerWidth) * 2 - 1
      mouse.y = -(mouseCoords.current.y / window.innerHeight) * 2 + 1
    }

    const allMeshes = reduce(Object.values(meshes.current))

    animate({ meshes: allMeshes })
    hover({ meshes: allMeshes, raycaster, mouse, camera, scene })

    renderer.render(scene, camera)
  }

  const hasChildren = children.length

  useEffect(() => {
    if (!hasChildren || !ref) return
    Object.values(meshes.current).map((m) => scene.add(m))
    animateScene()
    ref.appendChild(renderer.domElement)

    const listeners = Object.entries(events(props))

    if (listeners.length) {
      listeners.map(([event, func]) => {
        window.addEventListener(event, (e) => {
          raycaster.setFromCamera(mouse, camera)

          const hovered = raycaster
            .intersectObjects(scene.children, true)
            .filter((c) => c.object.hover)[0]

          func({ e, camera, scene, renderer, hovered })
        })
        return listeners
      })
    }
  })

  if (!hasChildren) return <EmptyCanvas />

  return (
    <CanvasWrapper mouseCoords={mouseCoords} reference={setRef}>
      {updatedChildren}
    </CanvasWrapper>
  )
}

const CanvasWrapper = ({ mouseCoords, reference, children }) => (
  <div
    onMouseMove={(e) => {
      mouseCoords.current = {
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
      }
    }}
    ref={reference}
  >
    {children}
  </div>
)

const EmptyCanvasWrapper = Component.lh28.pa100.flex.flexColumn.alignCenter.justifyCenter.bgGrey1.white.div()
const EmptyCanvas = () => (
  <EmptyCanvasWrapper>
    <Div>Nothing yet in your canvas !</Div>
    <Div>To start, add a component {`<Mesh />`}</Div>
  </EmptyCanvasWrapper>
)

const animate = ({ meshes }) => {
  const meshesToAnimate = findByProp('animate', meshes)

  if (meshesToAnimate.length) {
    meshesToAnimate.map((m) => {
      const { animate } = m
      animate(m)
      return m
    })
  }
}

const hover = ({ meshes, raycaster, mouse, camera, scene }) => {
  const meshesToHover = findByProp('hover', meshes)

  if (!meshesToHover.length) return
  if (!mouse.x && !mouse.y) return

  raycaster.setFromCamera(mouse, camera)

  const hovered = raycaster
    .intersectObjects(scene.children, true)
    .filter((c) => c.object.hover)[0]

  const meshesAfterHover = findByProp('afterHover', meshes)

  if (hovered) {
    meshesToHover.map((m) => {
      const { hover } = m
      hover(hovered.object, camera, scene)
      return m
    })
  } else if (meshesAfterHover.length) {
    meshesAfterHover.map((m) => {
      const { afterHover } = m
      afterHover(m, scene)
      return m
    })
  }
}

const coords = { x: 0, y: 0, z: 0 }

export const Group = ({
  meshes,
  name,
  position = coords,
  rotation = coords,
  shadow = true,
  animate,
  children = [],
  ...props
}) => {
  const groupProps = useRef({})

  const updatedChildren = flatten(children).map((child) => ({
    ...child,
    props: { ...child.props, groupProps, meshes },
  }))

  useEffect(() => {
    const group = new SetGroup()
    Object.values(groupProps.current).map((m) => {
      group.add(m)
      return group
    })

    group.name = name || `group-${generateId()}`

    const { x: px, y: py, z: pz } = position
    const { x: rx, y: ry, z: rz } = rotation
    group.position.set(px, py, pz)
    group.rotation.set(rx, ry, rz)

    group.receiveShadow = shadow

    meshes.current = {
      ...meshes.current,
      [group.name]: Object.assign(group, props, { animate }),
    }
  })

  return <Fragment>{updatedChildren}</Fragment>
}

export const Mesh = ({
  groupProps,
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

  const updatedChildren = flatten(children).map((child) => ({
    ...child,
    props: { ...child.props, meshProps },
  }))

  useEffect(() => {
    const geo = meshProps.current.geometry || new BoxGeometry()
    const mat = meshProps.current.material || new MeshNormalMaterial()

    const mesh = new SetMesh(geo, mat)
    mesh.name = name || `mesh-${generateId()}`

    const { x: px, y: py, z: pz } = position
    const { x: rx, y: ry, z: rz } = rotation
    mesh.position.set(px, py, pz)
    mesh.rotation.set(rx, ry, rz)

    mesh.receiveShadow = shadow

    if (groupProps) {
      groupProps.current = {
        ...groupProps.current,
        [mesh.name]: Object.assign(mesh, props, { animate }),
      }
      return
    }

    meshes.current = {
      ...meshes.current,
      [mesh.name]: Object.assign(mesh, props, { animate }),
    }
  })

  return <Fragment>{updatedChildren}</Fragment>
}

const geometries = {
  plane: PlaneGeometry,
  box: BoxGeometry,
  sphere: SphereGeometry,
}

export const Geometry = ({
  meshProps,
  type,
  width = 25,
  height = 25,
  depth = 25,
  ...props
}) => {
  const geometry = new geometries[type](width, height, depth)

  meshProps.current = {
    ...meshProps.current,
    geometry: Object.assign(geometry, props),
  }
  return null
}

const materials = {
  normal: MeshNormalMaterial,
  basic: MeshBasicMaterial,
  phong: MeshPhongMaterial,
}

export const Material = ({
  meshProps,
  type = 'normal',
  color = 'lightblue',
  texture,
  ...props
}) => {
  const material = new materials[type]({ color, side: DoubleSide })

  if (texture) {
    const loader = new TextureLoader().load(texture)
    material.map = loader
  }

  meshProps.current = {
    ...meshProps.current,
    material: Object.assign(material, props),
  }
  return null
}

export const Text = ({
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

const lights = {
  ambient: AmbientLight,
  directional: DirectionalLight,
  spot: SpotLight,
}

export const Light = ({
  meshes,
  name,
  color = 'white',
  position = coords,
  type = 'directional',
  ...props
}) => {
  const { x, y, z } = position
  const light = new lights[type](color)
  light.position.set(x, y, z)
  light.name = name || `light-${generateId()}`
  light.castShadow = true

  meshes.current = {
    ...meshes.current,
    [light.name]: Object.assign(light, props),
  }
  return null
}

import React from 'react'
import { Div } from './lib/design'
import {
  Canvas,
  Mesh,
  Group,
  Geometry,
  Material,
  Text,
  SpotLight,
} from './lib/three.js'
import { MeshPhongMaterial, MeshNormalMaterial } from 'three'

import { projects } from './projects.data.js'

export const Projects = ({ target }) => (
  <Div fixed style={{ overflow: target.current ? 'hidden' : 'auto' }}>
    <Canvas
      onWheel={({ e, camera, hovered, scene }) => {
        if (target.current && target.current.modale) return
        setTarget(hovered, target)
        setCamera(e, camera)
        scene.children.map((c) => (c.visible = true))
      }}
      onResize={({ camera, renderer }) => setSize(camera, renderer)}
      onMouseMove={({ hovered }) => {
        if (target.current && target.current.modale) return
        setTarget(hovered, target)
      }}
      onClick={({ hovered }) => setTarget(hovered, target, true)}
    >
      {projects.map((p, i) => (
        <ProjectMesh
          key={`${p.name}-text`}
          project={p}
          i={i}
          setTarget={setTarget}
          target={target}
        />
      ))}
      <SpotLight position={{ x: 30, y: 100, z: 200 }} />
    </Canvas>
  </Div>
)

const ProjectMesh = ({ project, i, setTarget, target, ...props }) => {
  const first = i === 0
  const { name, content, img } = project
  return (
    <Group
      position={{ x: 0, y: 0, z: -50 - i * 200 }}
      animate={(mesh) => (first || mesh.animateAfterHover) && rotate(mesh)}
      name={name}
      img={img}
      content={content}
      {...props}
    >
      <Cache name={name} {...props} />
      <Name name={name} {...props} />
    </Group>
  )
}

const Name = ({ name, ...props }) => (
  <Mesh
    hover={(mesh, camera, scene) => {
      hover(mesh, camera, scene)
    }}
    afterHover={(mesh, scene) => {
      mesh.material = new MeshPhongMaterial({ color: 0x5c5c5c })
      toggleVisible(mesh, scene, true)
    }}
    {...props}
  >
    <Text center text={name} size={20} depth={10} />
    <Material type="phong" color={0x5c5c5c} />
  </Mesh>
)

const Cache = ({ name, ...props }) => (
  <Mesh
    hover={(mesh, camera, scene) => {
      hover(mesh, camera, scene)
    }}
    afterHover={(mesh, scene) => {
      toggleVisible(mesh, scene, true)
    }}
    visible={false}
    {...props}
  >
    <Geometry width={name.length * 8} type="plane" />
    <Material type="basic" />
  </Mesh>
)

const toggleVisible = (mesh, scene, toggle) => {
  const otherMeshes = scene.children.filter(
    (c) =>
      mesh &&
      mesh.parent &&
      c.uuid !== mesh.parent.uuid &&
      c.type !== 'SpotLight',
  )
  otherMeshes.map((o) => (o.visible = toggle))
}

const hover = (mesh, camera, scene) => {
  const inView = camera.position.z - mesh.parent.position.z < 200
  if (!inView) {
    mesh.hoverable = false
    return
  }
  rotate(mesh.parent)
  mesh.parent.animateAfterHover = true
  mesh.hoverable = true
  if (mesh.visible) {
    mesh.material = new MeshNormalMaterial()
  }
  toggleVisible(mesh, scene, false)
}

const setCamera = (e, camera) => {
  const scrollDown = e.deltaY > 0
  const inViewUp = camera.position.z < 75
  const inViewDown = camera.position.z > -1750

  if (scrollDown) {
    if (!inViewDown) return
    camera.position.z = camera.position.z - 4
  } else {
    if (!inViewUp) return
    camera.position.z = camera.position.z + 4
  }
}

const setTarget = (hovered, target, modale) => {
  if (hovered && hovered.object.hoverable) {
    target.current = {
      name: hovered.object.parent.name,
      content: hovered.object.parent.content,
      img: hovered.object.parent.img,
      modale,
    }
  } else {
    target.current = undefined
  }
}

export const setSize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const rotate = (mesh) => {
  mesh.rotation.x += 0.001
  mesh.rotation.y += 0.001
  mesh.rotation.z += Math.sin(0.001)
}

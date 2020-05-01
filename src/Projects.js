import React, { Fragment } from 'react'
import { Div } from './lib/design'
import {
  Canvas,
  Mesh,
  Geometry,
  Material,
  Text,
  SpotLight,
} from './lib/three.js'
import { MeshPhongMaterial, MeshNormalMaterial } from 'three'
import { random } from './lib/toolbox.js'

import { projects } from './projects.data.js'

const onWheel = (e, camera) => {
  const scrollDown = e.deltaY > 0
  if (scrollDown) {
    camera.position.z = camera.position.z - 4
  } else {
    camera.position.z = camera.position.z + 4
  }
}

const onClick = (hovered, target) => {
  if (hovered) {
    target.current = {
      name: hovered.object.name,
      content: hovered.object.content,
    }
    window.setTimeout(() => (target.current = undefined), 500)
  }
}

export const resize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

export const Projects = ({ target }) => (
  <Div fixed>
    <Canvas
      onWheel={({ e, camera }) => onWheel(e, camera)}
      onResize={({ camera, renderer }) => resize(camera, renderer)}
      onClick={({ hovered }) => onClick(hovered, target)}
    >
      {projects.map((p, i) => (
        <Fragment key={p.name}>
          <ProjectText key={`${p.name}-text`} project={p} i={i} />
          <ProjectImage key={`${p.name}-img`} project={p} i={i} />
        </Fragment>
      ))}
      <SpotLight position={{ x: 30, y: 0, z: 150 }} />
    </Canvas>
  </Div>
)

const ProjectText = ({ project, i, ...props }) => (
  <Mesh
    hover={(mesh) => {
      rotate(mesh, i)
      mesh.material = new MeshPhongMaterial({ color: 0x5c5c5c })
    }}
    afterHover={(mesh) => {
      mesh.material = new MeshNormalMaterial()
    }}
    animate={(mesh) => {
      rotate(mesh, i)
    }}
    position={{ x: 0, y: 0, z: 5 - i * 150 }}
    rotation={{ x: random(0, 150), y: random(0, 150), z: 0 }}
    name={project.name}
    content={project.content}
    {...props}
  >
    <Text center text={project.name} size={20} depth={10} />
    <Material type="normal" />
  </Mesh>
)

const ProjectImage = ({ project, i, ...props }) => {
  const url = `https://raw.githubusercontent.com/MarieMalarme/marie-malarme/master/public/img/${project.img}`
  return (
    <Mesh
      position={{
        x: random(-75, 75),
        y: random(-45, 45),
        z: 5 - i * 150,
      }}
      {...props}
    >
      <Geometry type="plane" width={42} />
      <Material texture={url} type="phong" />
    </Mesh>
  )
}

const rotate = (mesh, i) => {
  if (i % 2 === 0) {
    mesh.rotation.x += 0.001
    mesh.rotation.y += 0.001
  } else {
    mesh.rotation.x += 0.001
    mesh.rotation.y += 0.001
  }
}

import { wrapper } from 'dallas'
import { flags } from './style.js'

export const Component = wrapper({ ...flags, consume: true })

export const Div = Component.div()
export const Span = Component.span()
export const Code = Component.white.mono.wsPre.code()

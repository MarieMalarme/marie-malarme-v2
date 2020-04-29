export const events = (props) => {
  return {
    ...(props.onKeyDown && { keydown: props.onKeyDown }),
    ...(props.onKeyUp && { keyup: props.onKeyUp }),
    ...(props.onKeyPress && { keypress: props.onKeyPress }),
    ...(props.onClick && { click: props.onClick }),
    ...(props.onDoubleClick && { dblclick: props.onDoubleClick }),
    ...(props.onMouseDown && { mousedown: props.onMouseDown }),
    ...(props.onMouseEnter && { mouseenter: props.onMouseEnter }),
    ...(props.onMouseLeave && { mouseleave: props.onMouseLeave }),
    ...(props.onMouseMove && { mousemove: props.onMouseMove }),
    ...(props.onMouseOver && { mouseover: props.onMouseOver }),
    ...(props.onMouseOut && { mouseout: props.onMouseOut }),
    ...(props.onMouseUp && { mouseup: props.onMouseUp }),
    ...(props.onWheel && { wheel: props.onWheel }),
    ...(props.onScroll && { scroll: props.onScroll }),
    ...(props.onResize && { resize: props.onResize }),
    ...(props.onTouchCancel && { touchcancel: props.onTouchCancel }),
    ...(props.onTouchStart && { touchstart: props.onTouchStart }),
    ...(props.onTouchEnd && { touchend: props.onTouchEnd }),
    ...(props.onTouchMove && { touchmove: props.onTouchMove }),
  }
}

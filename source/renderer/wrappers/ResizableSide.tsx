import React, { useEffect, useRef, useImperativeHandle, useCallback, useState } from "react"

type AperturePropsType = string | 'max-content'
type ApertureType = number | 'max-content'

interface ResizableSidePropsType {
  children?: React.ReactNode,
  direction?: 'right' | 'left' | 'top' | 'bottom',
  initialAperture?: AperturePropsType,
  minSize?: string,
  toggleIsOpenHash?: string | number, // When this value change the isOpen state is toggled
  onApertureChange?: (aperture: AperturePropsType) => void,
  onOpen?: () => void,
  onClose?: () => void,
  separator?: React.ReactNode,
}

interface StateType {
  isOpen: boolean,
  aperture: ApertureType,
}

const ResizableSide = React.forwardRef(function ResizableSide (
  {
    children=undefined,
    direction='right',
    initialAperture=undefined,
    minSize='0',
    toggleIsOpenHash=0,
    onApertureChange=undefined,
    onOpen=undefined,
    onClose=undefined,
    separator=undefined,
    ...aditionalProps
  }: ResizableSidePropsType & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  forwardedRef
) {
  const parsed = {
    minSize: parseInt(minSize) || 0,
  }
  const [state, setState] = useState<StateType>({
    isOpen: (
      initialAperture === 'max-content' || 
      (parseInt(initialAperture) || 0) > parsed.minSize
    ),
    aperture: parseInt(initialAperture) || 'max-content',
  })
  const containerRef = useRef<HTMLDivElement>()
  const dragableLineRef = useRef<HTMLDivElement>(null)

  // Proxy containerRef to parent
  useImperativeHandle(forwardedRef, () => containerRef.current, []);

  /**************************************************************************
  * Utils
  **************************************************************************/
  const references = [
    containerRef.current,
    dragableLineRef.current,
  ]
  const usingReferences = useCallback(function* () {
    if (
      containerRef.current === undefined || 
      dragableLineRef.current === undefined
    ) {
      return;
    }
    try {
      yield {
        container: containerRef.current,
        dragableLine: dragableLineRef.current
      }
    } finally {}
  }, [containerRef.current === undefined])

  const toggleIsOpen = () => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen
    }))
  }

  const setAperture = (aperture: ApertureType) => {
    if (typeof aperture === 'number') {
      setState((prev) => ({
        ...prev,
        aperture: aperture <= 0 ? 0 : aperture,
        isOpen: (aperture || 0) > (parseInt(minSize) || 0),
      }))
    } else {
      setState((prev) => ({
        ...prev,
        aperture: aperture
      }))
    }
  }

  /**************************************************************************
  * Open/Close container
  **************************************************************************/
  /* Change internal isOpen with toggle hash change */
  useEffect(() => {
    toggleIsOpen()
  }, [
    toggleIsOpenHash
  ])
  /**************************************************************************
  * Change container width/height using aperture as source
  **************************************************************************/

  /* Change container size using state values */
  useEffect(() => {
    for(const { container } of usingReferences()) {
      if (
        state.isOpen && typeof state.aperture == 'number' && 
        state.aperture > parsed.minSize
      ) {
        container.style.maxWidth = `${state.aperture}px`
      } else if (state.isOpen && state.aperture === 'max-content') { 
        container.style.maxWidth = 'max-content'
      } else {
        container.style.maxWidth = `${minSize}px`
      }
    }
  }, [
    state.aperture,
    state.isOpen
  ])
  /* Set listeners to calculate apeture using mouse position */
  useEffect(() => {
    for(const { container,  dragableLine } of usingReferences()) {
      const onMouseMove = (event: MouseEvent) => {
        event.preventDefault()
        if (!dragableLineRef.current) {
          return;
        }
        // Calculate aperture using container boundaries
        {
          const containerBoundaries = container.getBoundingClientRect()
          const aperture = event.clientX - containerBoundaries.left
          setAperture(aperture)
        }
      }
      const onMouseDown = () => {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      dragableLine.addEventListener('mousedown', onMouseDown)
      return () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        dragableLine.removeEventListener('mousedown', onMouseDown)
      }
    }
  }, [
    ...references,
  ])

  /**************************************************************************
  * Props callbacks
  **************************************************************************/

  useEffect(() => {
    onApertureChange && onApertureChange(
      state.aperture !== undefined ? `${state.aperture}px` : 'max-content'
    )
  }, [
    onApertureChange,
    state.aperture,
  ])

  useEffect(() => {
    state.isOpen ? 
      onOpen && onOpen() :
      onClose && onClose()
  }, [
    onOpen,
    onClose,
    state.isOpen,
  ])

  /**************************************************************************
  * Render component
  **************************************************************************/

  return (
    <div
      data-testid='resizable-side'
      ref={containerRef}
      {...aditionalProps}
      style={{
        position: 'relative',
        ...aditionalProps.style || {}
      }}
    >
      { children }
      <div
        data-testid='dragable-line'
        ref={dragableLineRef}
        style={{
          'right': {
            position: 'absolute',
            cursor: 'col-resize',
            top: '0',
            left: '100%',
            width: '5px',
            height: '100%'
          },
          'left': {
            position: 'absolute',
            cursor: 'col-resize',
            top: '0',
            left: '0',
            width: '5px',
            height: '100%'
          },
          'top': {
            position: 'absolute',
            cursor: 'row-resize',
            top: '0',
            left: '0',
            width: '100%',
            height: '5px'
          },
          'bottom': {
            position: 'absolute',
            cursor: 'row-resize',
            top: '100%',
            left: '0',
            width: '100%',
            height: '5px'
          }
        }[direction] as React.CSSProperties}
      >
        {separator}
      </div>
    </div>
  )
})

export default ResizableSide
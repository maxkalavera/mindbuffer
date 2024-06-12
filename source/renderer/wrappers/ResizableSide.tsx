import React, { useEffect, useRef, useImperativeHandle } from "react"

import VerticalDragableLine from './VerticalDragableLine'

interface ResizableSidePropsType {
  children?: React.ReactNode,
  minWidth?: string,
  maxWidth?: string,
  initialApeture?: number,
  sidebarToggleHash?: string | number,
  open?: boolean,
  aperture?: number,
  onApertureChange?: (aperture: number) => void,
  separator?: React.ReactNode,
}

export default React.forwardRef(function ResizableSide (
  {
    children=undefined,
    minWidth='64px',
    maxWidth='768px',
    initialApeture=undefined,
    sidebarToggleHash=undefined,
    open=undefined,
    aperture=undefined,
    onApertureChange=undefined,
    separator=undefined,
    ...aditionalProps
  }: ResizableSidePropsType & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  forwardedRef
) {
  const containerRef = useRef<HTMLDivElement>()
  const resizableRef = useRef<any>()

  // Proxy containerRef to parent
  useImperativeHandle(forwardedRef, () => containerRef.current, []);

  useEffect(() => {
    if (!containerRef.current)
      return
      resizableRef.current = containerRef.current.firstChild
  }, [containerRef.current])

  return (
    <div
      data-testid='resizable-side'
      ref={containerRef}
      /*
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
      }}
      */
      {...aditionalProps}
    >
      { children }
      <VerticalDragableLine
        data-testid='vertical-dragable-line'
        resizableRef={resizableRef}
        minWidth={parseInt(minWidth)}
        maxWidth={parseInt(maxWidth)}
        initialApeture={initialApeture}
        sidebarToggleHash={sidebarToggleHash}
        open={open}
        aperture={aperture}
        onApertureChange={onApertureChange}
        separator={separator}
      />
    </div>
  )
})
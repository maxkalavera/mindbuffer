import React, { useRef, useEffect, useState } from "react"

import commonsSlice from "@actions/commons.slice"
import store from "@src/store"
import styles from '@styles/vertical-dragable-line.module.css'

const APERTURE_BIAS = 0.025

export default function VerticalDragableLine ({
  className='',
  resizableRef
}: {
  className?: string,
  resizableRef: React.MutableRefObject<any>
}) {
  const [state, setState] = useState<{ aperture: number }>({ aperture: undefined })
  const [context, setContext] = useState({ 
    sidebarToggleHash: undefined,
  })
  const verticalLineRef = useRef<HTMLDivElement>(null)
  const minWidthRef = useRef<number>(null)
  const maxWidthRef = useRef<number>(null)
  __ENVIRONMENT__ === 'testing' ? state.aperture = 1.0 : void

  useEffect(() => {
    store.monitor(
      (state) => state.commons.sidebarToggleHash,
      (state) => setContext({ sidebarToggleHash: state.commons.sidebarToggleHash })
    )
  }, [])

  const apertureBufferRef = useRef<number>(1.0)
  useEffect(() => {
    if (context.sidebarToggleHash === undefined || state.aperture === undefined)
      return

    setState((prev) => ({
      ...prev,
      aperture: prev.aperture < APERTURE_BIAS ? apertureBufferRef.current : 0.0
    }))
    if (state.aperture > APERTURE_BIAS)
      apertureBufferRef.current = state.aperture
  }, [context.sidebarToggleHash])

  const isSidebarOpenRef = useRef<boolean>(undefined)
  useEffect(() => {
    if (!resizableRef.current) 
      return

    if (isSidebarOpenRef.current !== false && state.aperture < APERTURE_BIAS) {
      const { setIsSidebarOpen } = commonsSlice.actions
      store.dispatch(setIsSidebarOpen({ value: false }))
      isSidebarOpenRef.current = false
    } else if (isSidebarOpenRef.current !== true && state.aperture >= APERTURE_BIAS) {
      const { setIsSidebarOpen } = commonsSlice.actions
      store.dispatch(setIsSidebarOpen({ value: true }))
      isSidebarOpenRef.current = true
    }
  }, [
    resizableRef.current,
    state.aperture,
  ])

  useEffect(() => {
    if (resizableRef.current === undefined) 
      return

    const style = getComputedStyle(document.body)
    minWidthRef.current = 
      parseFloat(style.getPropertyValue('--sidebar-min-width')) * parseInt(style.fontSize)
    maxWidthRef.current = 
      parseFloat(style.getPropertyValue('--sidebar-max-width')) * parseInt(style.fontSize)
    resizableRef.current.classList.add(styles['with-transition'])
  }, [resizableRef.current])

  useEffect(() => {
    // Resize based on aperture var
    if (resizableRef.current === undefined || state.aperture === undefined)
      return

    let { aperture } = state
    if (aperture < 0.0) aperture = 0.0
    if (aperture > 1.0) aperture = 1.0
    const width = minWidthRef.current + (aperture * (maxWidthRef.current - minWidthRef.current))
    resizableRef.current.style.width = `${width}px`
  }, [resizableRef.current, state.aperture])


  /**************************************************************************
  * Set listeners
  **************************************************************************/
  useEffect(() => {

    if (!verticalLineRef.current) 
      return
    if (!resizableRef.current) 
      return

    const origin = { from: 0 }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!verticalLineRef.current) 
        return

      const { left } = resizableRef.current.getBoundingClientRect()
      setState({
        aperture:
          (event.clientX - (2 * minWidthRef.current) - left) / 
          (maxWidthRef.current - minWidthRef.current),
      })
    }
    const onMouseDown = () => {
      resizableRef.current.classList.remove(styles['with-transition'])
      origin.from = verticalLineRef.current.getBoundingClientRect().left
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseUp = () => {
      resizableRef.current.classList.add(styles['with-transition'])
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    verticalLineRef.current.addEventListener('mousedown', onMouseDown)
    return () => {
      if (verticalLineRef.current)
        verticalLineRef.current.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

  }, [
    verticalLineRef.current, 
    resizableRef.current, 
    minWidthRef.current, 
    maxWidthRef.current,
  ])

  /**************************************************************************
  * Store sidebar position in settings storage
  **************************************************************************/
  useEffect(() => {
    const controller = new AbortController();
    new Promise<number>(async (resolve, reject) => {
      const result = await window.electronAPI.settings.sidebarAperture.get()
      if (!controller.signal.aborted) {
        resolve(result)
      }
      reject('Sidebar aperture could not be retrived from storage')
    }).then((aperture) => {
      setState({ aperture })
    }).catch((reason) => {
      setState({ aperture: 1.0 })
    })
  }, [])

  useEffect(() => {
    if (state.aperture === undefined)
      return

    (async () => {
      await window.electronAPI.settings.sidebarAperture
      .set({ sidebarAperture: state.aperture })
    })()
  }, [state.aperture])

  return (
    <div
      className={`${className} ${styles['vertical-line']}`}
      ref={verticalLineRef}
    />
  )
}
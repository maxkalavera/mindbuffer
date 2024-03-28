import { reverse } from "lodash"
import React, { ReactElement, useState, useRef, useEffect, ReactNode } from "react"

interface InifiniteScrollProps {
  className?: string,
  items: ReactNode[],
  hasMore?: boolean,
  inverse?: boolean,
  scrollThreshold?: number,
  scrolledOver?: (scrolledOver: HTMLElement[], ...args: any[]) => any,
  next?: (...args: any[]) => any,
}

interface InifiniteScrollState {
  hasData: boolean,
  reachedEnd: boolean,
  dataLength: number,
}

export default function InifiniteScroll ({
  className='',
  items=[],
  hasMore=false,
  inverse=false,
  scrollThreshold=10,
  next=()=>{},
  scrolledOver=null,
}: InifiniteScrollProps) {
  const [state, setState] = useState<InifiniteScrollState>({
    hasData: false,
    reachedEnd: false,
    dataLength: 0,
  })
  /*
  * Notes:
  * This infinite scroll can't be used with flex-direction: column-inverse
  */
  const containerRef = useRef<HTMLDivElement>()

  useEffect(() => {
    // Initial set up
    if (
      containerRef.current && 
      items.length > 0 &&
      !state.hasData
    ) {
      setState((prevState) => ({
        ...prevState,
        hasData: true,
        dataLength: items.length
      }))

      // Position the scroll in the starting side
      if (inverse) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
        containerRef.current.scroll({
          top: containerRef.current.scrollHeight,
          behavior: 'instant',
        })
      } else {
        containerRef.current.scroll({ top: 0 })
      }
    }
  }, [containerRef.current, items])

  useEffect(() => {
    // Checks if the scrolling has reached the end of the scrolling space
    if (containerRef.current === null) return

    const listener = () => {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current

      // Notify when a childelement has been scrolled over
      if (scrolledOver) {
        const { children, childElementCount } = containerRef.current
        const { 
          top: parentTop,
          bottom: parentBottom,
        } = containerRef.current.getBoundingClientRect()
        let references = Array()
        for (let i = 0; i < childElementCount; i++) {
          const element = children.item(i) as HTMLElement
          const reachedLine = element.getBoundingClientRect()[inverse ? 'top' : 'bottom']
          if (
            parentTop <= reachedLine &&
            parentBottom >= reachedLine
          ) {
            references.push(element)
          }
        }
        scrolledOver(references)
      }

      if (
        (
          inverse &&
          scrollTop <= scrollThreshold
        ) ||
        (
          !inverse &&
          scrollTop + clientHeight >= scrollHeight - scrollThreshold
        )
      ) {
        setState((prev) => ({
          ...prev,
          reachedEnd: true,
        }))
      }
    }
    containerRef.current.addEventListener('scroll', listener, {passive: true})
    return () => containerRef.current.removeEventListener('scroll', listener)
  }, [containerRef.current])

  useEffect(() => {
    // Call Next function to fetch new items
    if (
      containerRef.current && 
      hasMore &&
      state.hasData && 
      state.reachedEnd
    ) {
      next()
    }
  }, [containerRef.current, state.reachedEnd])

  useEffect(() => {
    if (
      containerRef.current && 
      hasMore &&
      state.hasData && 
      state.reachedEnd &&
      state.dataLength !== items.length
    ) {
      setState((prev) => ({
        ...prev,
        reachedEnd: false,
        dataLength: items.length
      }))
    }
  }, [
    containerRef.current, 
    hasMore,
    state.hasData, 
    state.reachedEnd, 
    items
  ])

  //console.log('-> ITEMS')
  //console.log(items)

  return (
    <div
      className={`${className}`}
      ref={containerRef}
    >
      { 
        inverse ? 
          items.slice().reverse() :
          items
      }
    </div>
  )
}
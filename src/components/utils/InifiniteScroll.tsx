import { reverse } from "lodash"
import React, { ReactElement, useState, useRef, useEffect, ReactNode } from "react"

interface InifiniteScrollProps {
  className?: string,
  items: ReactNode[],
  hasMore?: boolean,
  inverse?: boolean,
  scrollThreshold?: number,
  adjustScrollHash?: string,
  scrollBeginingHash?: string,
  getItemIdentifier?: (...args: any[]) => string 
  next?: (...args: any[]) => any,
  scrolledOver?: (scrolledOver: HTMLElement[], ...args: any[]) => any,
}

export default function InifiniteScroll ({
  className='',
  items=[],
  hasMore=false,
  inverse=false,
  scrollThreshold=10,
  adjustScrollHash=undefined,
  scrollBeginingHash=undefined,
  getItemIdentifier=(item) => item.key === undefined ? item.toString() : item.key,
  next=()=>{},
  scrolledOver=null,
}: InifiniteScrollProps) {
  /*
  * Notes:
  * This infinite scroll can't be used with flex-direction: column-inverse
  */
  const containerRef = useRef<HTMLDivElement>()

  const scrollBegining = () => {
    // Position the scroll in the starting side
    if (!containerRef.current)
      return

    if (inverse) {
      containerRef.current.scroll({
        top: containerRef.current.scrollHeight,
        // @ts-ignore
        behavior: 'instant',
      })
    } else {
      containerRef.current.scroll({ 
        top: 0,
        // @ts-ignore
        behavior: 'instant',
      })
    }
  }

  const adjustScroll = () => {
      // Position the scroll in the starting side
      if (!containerRef.current)
        return
  
      if (inverse) {
        containerRef.current.scroll({
          top: containerRef.current.scrollHeight - lastScrollHeightRef.current,
          // @ts-ignore
          behavior: 'instant',
        })
      } else {
        containerRef.current.scroll({
          top: lastScrollHeightRef.current,
          // @ts-ignore
          behavior: 'instant',
        })
      }
  }

  useEffect(() => {
    if (items.length > 0) {
      adjustScroll()
    }
  }, [adjustScrollHash])

  useEffect(() => {
    if (items.length > 0) {
      scrollBegining()
    }
  }, [scrollBeginingHash])

  const lastScrollHeightRef = useRef<number>(0)
  const itemsHash = JSON.stringify(items.map(getItemIdentifier))  
  const ListenToScrollEnd = () => {
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current

    lastScrollHeightRef.current = scrollHeight
    if (
      (inverse && scrollTop <= scrollThreshold) ||
      (!inverse && scrollTop + clientHeight >= scrollHeight - scrollThreshold)  
    ) {
      containerRef.current.removeEventListener(
        'scroll', ListenToScrollEnd)
      next()
    }
  }

  useEffect(() => {
    // Checks if the scrolling has reached the end of the scrolling space
    if (containerRef.current === undefined)
      return

    containerRef.current.addEventListener(
      'scroll', ListenToScrollEnd, {passive: true})
    return () => containerRef.current.removeEventListener(
      'scroll', ListenToScrollEnd)
  }, [
    containerRef.current, 
    itemsHash
  ])

  return (
    <div
      className={`${className}`}
      ref={containerRef}
    >
      { items }
    </div>
  )
}

/*
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
*/
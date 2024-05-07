import React, { ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

import styles from "@styles/dropdown-menu.module.css"

function DropdownMenu ({
  children=[],
  className= '',
  options=[]
}: {
  children?: ReactElement[] | ReactElement | null,
  className?: string,
  options?: {
    label?: string
    onClick?: () => void
    icon?: IconProp,
    className?: string,
  }[]
}) {
  const containerRef = useRef<any>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const closeDropdown = () => {
    setIsVisible(false)
    document.removeEventListener('click', closeDropdown)
    document.removeEventListener('click', onClickOutside)
  }

  const onClickOutside = (event: MouseEvent) => {
    if (containerRef.current === null) return 
    if (contentRef.current === null) return 

    if (!containerRef.current.contains(event.target)) {
      closeDropdown()
      document.removeEventListener('click', onClickOutside)
    }
  }

  const openDropdown = () => {
    if (containerRef.current === null) return 
    if (contentRef.current === null) return 

    setIsVisible(true)
    const {left, top} = containerRef.current.getBoundingClientRect()
    contentRef.current.style.left = `${left}px`
    contentRef.current.style.top = `${top}px`

    document.addEventListener('click', onClickOutside)
  }

  useLayoutEffect(() => {
    if (containerRef.current === null) return 

    !isVisible ? 
      containerRef.current.addEventListener('click', openDropdown) :
      containerRef.current.addEventListener('click', closeDropdown)
    return () => {
      containerRef.current.removeEventListener('click', openDropdown)
      containerRef.current.removeEventListener('click', closeDropdown)
    }
  }, [containerRef.current, isVisible])

  return (
    <div 
      className={`${styles.container} ${className}`}
      ref={containerRef}
    >
      { children }

      <div 
        className={`${styles.content}`}
        ref={contentRef}
        style={{display: isVisible ? 'flex' : 'none'}}
      >
        {
          options.map((item, index) => (
            <button 
              key={index}
              onClick={() => {
                item.onClick()
                closeDropdown()
              }}
              className={[
                styles.option,
                item.className,
              ].join(' ')}
            >
              { 
                item.icon ? 
                  <FontAwesomeIcon 
                    icon={item.icon} 
                  /> : null 
              }
              <h5 className={`secondary-h5 ${styles['option-label']}`}>{ item.label }</h5>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default DropdownMenu;
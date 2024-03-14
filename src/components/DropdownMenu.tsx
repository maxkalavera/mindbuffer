import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

import styles from "@styles/dropdown-menu.module.css"

function DropdownMenu ({
  children=[],
  className= '',
  type='clickable',
  options=[]
}: {
  children?: ReactElement[] | ReactElement | null,
  className?: string,
  type?: 'clickable' | 'hoverable'
  options?: {
    label?: string
    onClick?: () => void
    icon?: IconProp
  }[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (containerRef.current === null && type !== 'clickable') return
    const focusOut = () => {
      setIsVisible(false)
    }
    containerRef.current.addEventListener('focusout', focusOut)
    return () => {
      if (containerRef.current === null) return
      containerRef.current.removeEventListener('focusout', focusOut)
    }
  }, [containerRef.current, type])

  return (
    <div 
      className={`${styles.container} ${type === 'hoverable' ? styles.hoverable : ''}`}
      ref={containerRef}
      onClick={() => setIsVisible(true)}
    >
      { children }
      <div 
        className={`${styles.content}`}
        style={{
          display: type === 'clickable' ? (isVisible ? 'flex' : 'none') : null
        }}
      >
        {
          options.map((item, index) => (
            <button 
              key={index}
              onClick={item.onClick}
              className={styles.option}
            >
              <div className={styles['option-icon']}>
                { 
                  item.icon ? 
                    <FontAwesomeIcon icon={item.icon} /> : 
                    null 
                }
              </div>
              <h5 className={`secondary-h5 ${styles['option-label']}`}>{ item.label }</h5>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default DropdownMenu;
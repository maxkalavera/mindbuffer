import React, { ReactElement } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

import styles from "@styles/dropdown-menu.module.css"

function DropdownMenu ({
  children=[],
  className= '',
  options=[]
}: {
  children?: ReactElement[]
  className?: string
  options?: {
    label: string
    onClick: () => void
    icon?: IconProp
  }[]
}) {
  return (
    <div className={styles.container}>
      { children }
      <div className={styles.content}>
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
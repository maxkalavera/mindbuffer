import React from 'react'

import styles from "@styles/input.module.css"

export default function Input ({
  className='',
  label='',
  value='',
  maxlength=undefined,
  onChange=()=>undefined,
  onEnter=()=>undefined,
}: {
  className?: string,
  label?: string,
  value?: string,
  maxlength?: number,
  onChange?: (...args: any[]) => any,
  onEnter?: (...args: any[]) => any,
}) {
  return (
    <div className={`${className} ${styles.container}`}>
      <p className={`secondary-p ${styles.label}`}>{label}</p>
      <input 
        className={styles.input}
        type='text' 
        maxLength={maxlength}
        value={value} 
        onChange={onChange}
        onKeyDown={
          (event: any) => (event.key === 'Enter') ? 
            onEnter(event) : 
            undefined
        }
      />
    </div>
  )
}
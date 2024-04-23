import React from 'react'

import styles from "@styles/input.module.css"

export default function Input ({
  className='',
  label='',
  value='',
  onChange=()=>undefined,
  onEnter=()=>undefined,
}: {
  className?: string,
  label?: string,
  value?: string,
  onChange?: (...args: any[]) => any,
  onEnter?: (...args: any[]) => any,
}) {
  return (
    <div className={styles.container}>
      <p className={`secondary-p ${styles.label}`}>{label}</p>
      <input 
        className={styles.input}
        type='text' 
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
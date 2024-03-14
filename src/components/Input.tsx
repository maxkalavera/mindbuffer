import React from 'react'

import styles from "@styles/input.module.css"

export default function Input ({
  className='',
  label='',
  value='',
  onChange=()=>null
}: {
  className?: string,
  label?: string,
  value?: string,
  onChange?: (...args: any[]) => any
}) {
  return (
    <div className={styles.container}>
      <p className={`secondary-p ${styles.label}`}>{label}</p>
      <input 
        className={styles.input}
        type='text' 
        value={value} 
        onChange={onChange}
      />
    </div>
  )
}
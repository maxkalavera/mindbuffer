import React from "react"

import styles from "@renderer/styles/button.module.css"

function Button({
  className='',
  label='',
  onClick =()=> null,
  type='primary'
}: {
  className?: string,
  label?: string,
  onClick?: () => void,
  type?: 'primary' | 'secondary'
}) {
  return (
    <button
      className={`${className} ${styles[type]} ${styles.button}`}
      onClick={onClick}
    >
      <h4 className={`secondary-h4`}>
        { label }
      </h4>
    </button>
  );
}

export default Button;
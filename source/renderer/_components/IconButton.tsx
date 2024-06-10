import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from "@renderer/styles/icon-button.module.css"

import type { IconProp } from '@fortawesome/fontawesome-svg-core'

function IconButton({
  id="",
  className="",
  icon=undefined,
  disabled=false,
  onClick =() => null,
}: {
  id?: string,
  className?: string,
  icon?:  IconProp,
  disabled?: boolean,
  onClick?: () => void
}) {
  return (
    <button
      id={id}
      className={`${className} ${styles.button}`}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

export default IconButton
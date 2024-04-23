import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from "@styles/icon-button.module.css"

import type { IconProp } from '@fortawesome/fontawesome-svg-core'

function IconButton({
  className = "",
  icon=undefined,
  disabled=false,
  onClick = () => null,
}: {
  className?: string,
  icon?:  IconProp,
  disabled?: boolean,
  onClick?: () => void
}) {
  return (
    <button
      className={`${className} ${styles.button}`}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

export default IconButton;
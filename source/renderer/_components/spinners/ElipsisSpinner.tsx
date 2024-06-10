import React from "react"
import styles from "@renderer/styles/elipsis-spinner.module.css"

function Spinner({
  className="",
}: {
  className?: string,
}) {
  return (
    <span
      className={`${className} ${styles.loader}`}
    >
    </span>
  );
}

export default Spinner;
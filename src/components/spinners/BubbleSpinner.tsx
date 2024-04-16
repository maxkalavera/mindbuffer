import styles from "@styles/bubble-spinner.module.css"

function Spinner({
  className="",
  inverse=false,
}: {
  className?: string,
  inverse?: boolean,
}) {
  return (
    <span
      className={`${className} ${styles.loader} ${inverse ? styles['loader__inverse'] : ''}`}
    >
    </span>
  );
}

export default Spinner;
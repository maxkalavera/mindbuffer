import styles from "@styles/searchbar.module.css";

function Searchbar({
  className = "",
  value = "",
  onChange = () => undefined
}: {
  className?: string,
  value?: string
  onChange?: (value: string | undefined) => void
}) {
  return (
    <input
      type="text"
      placeholder="Search..."
      className={`${styles.searchbar} ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    ></input>
  );
}

export default Searchbar;
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel";
import styles from "@styles/add-note-input.module.css"

function AddNoteInput() {
  return (
    <div className={styles.container}>
      <textarea
        placeholder="Add some thoughts..."
        className={`${styles.textarea}`}
      />
      <AddNoteButtonCarrousel />
    </div>
  );
}

export default AddNoteInput;
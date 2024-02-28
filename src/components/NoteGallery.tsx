import TextNote from "@components/TextNote"
import styles from "@styles/note-gallery.module.css"

function NoteGallery() {
  const text = `<!DOCTYPE html>
  <html>
      <body>
          <p>Hello world!</p>
      </body>
  </html>`
  return (
    <div className={styles.container}>
      <TextNote text={text} />
    </div>
  );
}

export default NoteGallery;
import { useEffect, useRef } from "react";
import styles from "@styles/text-note.module.css"

function TextNote({
  text=''
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  })

  return (
    <div className={styles.container}>
      <textarea ref={textareaRef} className={styles.textarea} disabled>{text}</textarea>
    </div>
  );
}

export default TextNote;
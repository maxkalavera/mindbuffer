import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import Page from "@components/Page"
import styles from "@styles/pages.module.css"

function Pages() {
  const [items, setItems] = useState<{
    id: number, 
    name: string, 
    count: number
  }[]>([{
    id: 0,
    name: 'Page 0',
    count: 0,
  }, {
    id: 1,
    name: 'Page 1',
    count: 3,
  }]);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {
          items.map((item) => (
            <Page 
              key={item.id}
              name={item.name}
              count={item.count}
            />
          ))
        }
      </div>
      <div className={styles['add-row']}>
        <button className={styles['add-button']}>
          <FontAwesomeIcon icon={faPlus} />
          <h4 className="secondary-h4">
            Add page
          </h4>
        </button>
      </div>
    </div>
  );
}

export default Pages;
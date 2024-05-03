import React, { useState, useEffect } from 'react'
import ContentLoader from 'react-content-loader'

import store from '@src/store'
import styles from "@styles/selected-page.module.css"

export default function SelectedPage ({
  className='',
}: {
  className?: string,
}) {
  const [context, setContext] = useState({
    pages: {
      selectedPage: undefined,
      loading: false,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPage: state.pages.selectedPage,
        loading: state.pages.loadingSelectedPage
      }), 
      (state) => {
        setContext({
          pages: {
            selectedPage: state.pages.selectedPage,
            loading: state.pages.loadingSelectedPage
          }
        })
      },
    )
  }, [])

  const selectedPage = context.pages.selectedPage
  return (
    <div 
      className={[
        className,
        styles.container,
        selectedPage ? styles.open : styles.closed,
      ].join(' ')}
      style={{
        alignItems: context.pages.loading ? 'flex-end' : ''
      }}
    >
      {
        context.pages.loading ? 
          (
            <>
              <ContentLoader
                height={30}
                speed={1}
                backgroundColor={'#333'}
                foregroundColor={'#999'}
                viewBox="0 0 150 30"
              >
                <rect x="100" y="0" rx="3" ry="3" width="50" height="8" />
                <rect x="0" y="16" rx="3" ry="3" width="150" height="12" />
              </ContentLoader>
            </>
          ):
          (
            <>
              <h5 
                className={`secondary-h5 ${styles.notepad}`}
              >
                {selectedPage ? selectedPage.notepad.name : ''}
              </h5>
              <h4
                className={`secondary-h4 ${styles.page}`}
              >
                {selectedPage ? selectedPage.name : ''}
              </h4>
            </>
          )
      }
    </div>
  )
}
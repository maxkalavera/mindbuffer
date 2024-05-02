import React, { useEffect, useState } from "react"

import store from "@src/store"
import { useAlert } from "@providers/Alert"
import { updatePageThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/update-page-modal.module.css"

import type { Page } from "@ts/models/Pages.types"

export default function UpdatePage ({
  className='',
  value,
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  className?: string,
  value: Page,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { showAlert } = useAlert()
  const { closeModal } = useModal()
  const [state, setState] = useState({
    name: '',
  })

  useEffect(() => {
    setState({
      name: value.name,
    })
  }, [JSON.stringify(value)])

  const updatePage = () => {
    store.dispatch(updatePageThunk({
      value: {
        ...value,
        name: state.name,
      }
    })).then(() => {
      showAlert({ message: 'Page updated', type: 'success' })
    })
  }

  const _onCancel = () => {
    onCancel()
    closeModal()
  }

  const _onSuccess = () => {
    updatePage()
    onSuccess()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <Input
        className={[
          styles.input,
          __ENVIRONMENT__ === 'testing' ? `class:page-modal-name-input-wrapper:o0Tmq3A18Z` : ''
        ].join(' ')}
        label={'Name:'}
        value={state.name}
        maxlength={50}
        onChange={(event) => setState({
          name: event.target.value
        })}
        onEnter={_onSuccess}
      />
      <div className={styles.options}>
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Save'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}
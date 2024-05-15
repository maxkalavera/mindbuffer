import React, { useEffect, useState } from "react"

import store from "@renderer/utils/store"
import { useAlert } from "@renderer/providers/Alert"
import { updatePageThunk } from "@renderer/actions/notepads.slice"
import { useModal } from '@renderer/providers/Modal'
import Input from '@renderer/components/Input'
import Button from "@renderer/components/Button"
import styles from "@renderer/styles/update-page-modal.module.css"

import type { Page } from "@commons/ts/models/Pages.types"

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
          globals.ENVIRONMENT === 'testing' ? `class:page-modal-name-input-wrapper:o0Tmq3A18Z` : ''
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
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Save'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}
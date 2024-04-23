import React, { useEffect, useState } from "react"

import store from "@src/store"
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
    }))
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
        className={styles.input}
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
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          label={'Save'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}
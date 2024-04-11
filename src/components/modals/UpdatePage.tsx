import React, { useEffect, useState } from "react"

import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/update-page-modal.module.css"

export default function UpdatePage ({
  className='',
  data={},
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  className?: string,
  data: any,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { closeModal } = useModal()
  const [state, setState] = useState({
    name: '',
  })

  useEffect(() => {
    setState({
      name: data.name,
    })
  }, [JSON.stringify(data)])

  const updatePage = () => {
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
        onChange={(event) => setState({
          name: event.target.value
        })}
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
import React from "react"

import TextNote from "@renderer/components/TextNote"

import { NoteType } from '@ts/models/Notes.types'

function Note (
  { 
    data,
    ...childProps
  }: Parameters<typeof TextNote>[0] & { data: NoteType }
) {
  return (
    <>
      <TextNote 
        data={data}
        {...childProps}
      />
    </>
  )
}

export default Note
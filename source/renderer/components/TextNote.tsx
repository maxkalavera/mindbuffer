import React from "react"

import { NoteType } from '@ts/models/Notes.types'
import { Reset } from "@radix-ui/themes"

function TextNote (
  { 
    data,
  }: { 
    data: NoteType 
  }
) {
  return (
    <Reset>
      <div
        style={{
          width: '100%'
        }}
      >
        { data.content }
      </div>
  </Reset>
  )
}

export default TextNote
import React from 'react'
import { Box } from '@radix-ui/themes'

import type { BoxProps } from '@radix-ui/themes'

function NotesBoard (props: BoxProps) {
  return (
    <Box
      data-testid='notes-board'
      {...props}
    >

    </Box>
  )
}

export default NotesBoard
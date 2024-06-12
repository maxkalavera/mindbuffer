import React from "react"

import { NoteType } from '@ts/models/Notes.types'
import { Box, Card, Flex, IconButton, Reset } from "@radix-ui/themes"

import { DotsVerticalIcon } from '@radix-ui/react-icons'

import type { BoxProps } from "@radix-ui/themes"

function TextNote ({ 
  data,
  ...containerProps
}: BoxProps & { data: NoteType }) {
  return (
    <Box
      {...containerProps}
    >
      <Card
        data-radius='small'
      >
        <Flex
          direction='row'
          gap='4'
          justify='end'
          align='start'
        >
          <Flex
            direction='column'
            gap='4'
            justify='start'
            align='end'
          >
            <Reset>
              <div>
                { data.content }
              </div>
            </Reset>
          </Flex>
          <Flex
            direction='column'
            gap='0'
            justify='start'
            align='start'
          >
            <IconButton
              variant="ghost"
              size='1'
            >
              <DotsVerticalIcon width='14' height='14' />
            </IconButton>
          </Flex>
        </Flex>
      </Card>
    </Box>
  )
}

export default TextNote
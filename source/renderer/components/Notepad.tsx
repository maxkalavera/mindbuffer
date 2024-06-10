import React from 'react'
import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import Page from '@renderer/components/Page'

import type { FlexProps } from '@radix-ui/themes'
import type { NotepadType } from "@ts/models/Notepads.types"
import { PageType } from '@ts/models/Pages.types'

function Notepad ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: NotepadType,
  loading?: boolean,
}) {
  return (
    <Flex
      direction='column'
      gap='2'
      justify='start'
      align='stretch'
      {...flexProps}
    >
      <Flex 
        direction='row'
        gap='4'
        justify='between'
        align='stretch'
      >
        <Text 
          size='2' 
          weight='bold'
        >
          {data.name}
        </Text>
        <IconButton
          size='1'
          variant='ghost'
        >
          <DotsHorizontalIcon width='18' height='18' />
        </IconButton>
      </Flex>
      <Flex
        direction='column'
        gap='0'
        justify='start'
        align='stretch'
      >
        {
          (data.pages ? data.pages : []).map((item: PageType) => (
            <Page 
              key={item.id} 
              data={item} 
            />
          ))
        }
      </Flex>
    </Flex>
  )
}

export default Notepad
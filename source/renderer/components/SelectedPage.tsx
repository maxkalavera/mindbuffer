import React, { useState, useEffect } from 'react'
import { Box, Card, Flex, Heading } from '@radix-ui/themes'

import store from '@renderer/utils/store'

import type { BoxProps } from '@radix-ui/themes'

export default function SelectedPage (props: BoxProps) {
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
  const hasSelectedPage = selectedPage === undefined
  return (
    <Box
      className={`selected-page ${hasSelectedPage ? 'selected-page--hidden' : ''}`}
      py='6'
      {...props}
    >
      <Card
        data-radius='none'
        className='selected-page--card'
        variant='surface'
      >
        <Flex
          direction='column'
          gap='1'
          justify='center'
          align='stretch'
        >
          <Heading
            size='1'
            color='gray'
            align='right'
          >
            {selectedPage ? selectedPage.notepad.name : ''}
          </Heading>
          <Heading
            size='4'
            align='right'
          >
            {selectedPage ? selectedPage.name : ''}
          </Heading>
        </Flex>
      </Card>
    </Box>
  )
}
import React from 'react'

import { Flex, type FlexProps } from '@radix-ui/themes'
import type { PageType } from "@ts/models/Pages.types"

function Page ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: PageType,
  loading?: boolean,
}) {
  return (
    <Flex 
      direction='row'
      gap='4'
      justify='between'
      align='stretch'
      {...flexProps}
    >
    </Flex>
  )
}

export default Page
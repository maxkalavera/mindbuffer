import React from 'react'
import { DropdownMenu, Flex } from "@radix-ui/themes"

const CustomItem = React.forwardRef(function (
  props: Parameters<typeof DropdownMenu.Item>[0] & {},
  ref
) {
  return (
    <DropdownMenu.Item
      ref={ref as any}
      asChild={true}
      {...props}
    >
      <Flex
        direction='row'
        gap='2'
        justify='between'
        align='center'
      >
        {props.children}
      </Flex>
    </DropdownMenu.Item>
  )
})

export default {
  ...DropdownMenu,
  Item: CustomItem,
}
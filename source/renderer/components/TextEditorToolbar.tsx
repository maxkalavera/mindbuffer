import React, { ReactNode, Ref, PropsWithChildren } from "react"
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate'
import { useSlate } from 'slate-react'
import { Flex, IconButton } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { } from '@fortawesome/free-regular-svg-icons'
import { } from '@fortawesome/free-solid-svg-icons'
import { 
  FontBoldIcon, 
  FontItalicIcon, 
  UnderlineIcon,
  CodeIcon,
  QuoteIcon,
  ListBulletIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  TextAlignCenterIcon,
} from "@radix-ui/react-icons"

import type { ElementType, NodeType } from "@ts/slate.types"
import type { FlexProps, IconButtonProps } from "@radix-ui/themes"


/******************************************************************************
* Utils
******************************************************************************/

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes<NodeType>(editor, {
    match: (node: NodeType) => 
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      LIST_TYPES.includes(node.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<ElementType>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<ElementType>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

/******************************************************************************
* Secondary components
******************************************************************************/

const BlockButton = React.forwardRef(
  (
    { 
      format,
      ...iconButtonProps 
    }: IconButtonProps & {
      format: any,
    },
    ref: React.LegacyRef<HTMLButtonElement>
  ) => {
  const editor = useSlate()
  return (
    <IconButton
      ref={ref}
      variant='ghost'
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      {...iconButtonProps }
    />
  )
})


const MarkButton = React.forwardRef(
  (
    { 
      format,
      ...iconButtonProps 
    }: IconButtonProps & {
      format: any,
    },
    ref: React.LegacyRef<HTMLButtonElement>
  ) => {
  const editor = useSlate()
  return (
    <IconButton
      ref={ref}
      variant='ghost'
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      {...iconButtonProps }
    />
  )
})


const Group = React.forwardRef((
  {
    ...flexProps
  }: FlexProps & {},
  ref: React.LegacyRef<HTMLDivElement>
) => {
  return (
    <Flex
      direction='row'
      justify='start'
      align='center'
      gap='1'
      ref={ref}
      {...flexProps}
    />
  )
})

/******************************************************************************
* Renderer component
******************************************************************************/

const ICONS_SIZE = {
  width: '18',
  height: '18'
}
const TextEditorToolbar = React.forwardRef(function TextEditorToolbar (
  {
    ...flexProps
  }: FlexProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <Flex
      direction='row'
      justify='start'
      align='center'
      gap='3'
      ref={ref}
      {...flexProps}
    >
      <Group>
        <MarkButton format="bold">
          <FontAwesomeIcon
            size='sm'
            icon={null}
          />
          <FontBoldIcon {...ICONS_SIZE} />
        </MarkButton>
        <MarkButton format="italic">
          <FontItalicIcon {...ICONS_SIZE} />
        </MarkButton>
        <MarkButton format="underline">
          <UnderlineIcon {...ICONS_SIZE} />
        </MarkButton>
      </Group>

      <Group>
        <MarkButton format="code">
          <CodeIcon {...ICONS_SIZE} />
        </MarkButton>
        <BlockButton format='block-quote'>
          <QuoteIcon {...ICONS_SIZE} />
        </BlockButton>
      </Group>

      <Group>
        <BlockButton format='numbered-list'>
        </BlockButton>
        <BlockButton format='bulleted-list'>
          <ListBulletIcon {...ICONS_SIZE} />
        </BlockButton>
      </Group>

      <Group>
        <BlockButton format='left'>
          <TextAlignLeftIcon {...ICONS_SIZE} />
        </BlockButton>
        <BlockButton format='center'>
          <TextAlignCenterIcon {...ICONS_SIZE} />
        </BlockButton>
        <BlockButton format='right'>
          <TextAlignRightIcon {...ICONS_SIZE}/>
        </BlockButton>
        <BlockButton format='justify'>
          <TextAlignJustifyIcon {...ICONS_SIZE} />
        </BlockButton>
      </Group>
    </Flex>
  )
})

export default TextEditorToolbar
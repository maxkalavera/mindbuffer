import React  from "react"
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate'
import { useSlate } from 'slate-react'
import { Flex, IconButton, Select } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSquare, 
} from '@fortawesome/free-regular-svg-icons'
import { 
  faHeader, 
  faBold, 
  faItalic, 
  faUnderline, 
  faStrikethrough,
  faCode,
  faListOl,
  faListCheck,
  faListUl,
  faQuoteRight,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

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

const MarkSelect = React.forwardRef(
  (
    {
      items=[]
    }: {
      items: { 
        value: string, 
        label: string, 
        className?: string,
        default?: boolean,
      }[]
    },
    ref: any
  ) => {
    const editor = useSlate()
    return (
      <Select.Root 
        defaultValue='normal'
      >
        <Select.Trigger variant='ghost'>
          <FontAwesomeIcon
            size='sm'
            icon={faHeader}
          />
        </Select.Trigger>
        <Select.Content variant='soft' >
          <Select.Item value="normal">
            Normal
          </Select.Item>
          <Select.Item value="h1">
            Heading 1
          </Select.Item>
          <Select.Item value="h2">Heading 2</Select.Item>
          <Select.Item value="h3">Heading 3</Select.Item>
        </Select.Content>
      </Select.Root>
    )
  }
)


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
      gap='2'
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
      ref={ref}
      {...flexProps}
      direction='row'
      justify='start'
      align='center'
      gap='4'
    >
      <Group>
        <MarkSelect 
          items={[
            { value: 'h1', label: 'Heading 1'},
            { value: 'h2', label: 'Heading 2'},
            { value: 'h3', label: 'Heading 3'},
          ]}
        />
      </Group>

      <Group>
        <MarkButton format="bold">
          <FontAwesomeIcon
            size='sm'
            icon={faBold}
          />
        </MarkButton>
        <MarkButton format="italic">
          <FontAwesomeIcon
            size='sm'
            icon={faItalic}
          />
        </MarkButton>
        <MarkButton format="underline">
          <FontAwesomeIcon
            size='sm'
            icon={faUnderline}
          />
        </MarkButton>
        <MarkButton format="strikethrough">
          <FontAwesomeIcon
            size='sm'
            icon={faStrikethrough}
          />
        </MarkButton>
      </Group>

      <Group>
        <MarkButton format="inline-code">
          <FontAwesomeIcon
            size='sm'
            icon={faCode}
          />
        </MarkButton>
        <BlockButton format='block-code'>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon
              size='sm'
              icon={faSquare}
              transform={'grow-4'}
            />
            <FontAwesomeIcon
              size='sm'
              icon={faCode}
              transform={'shrink-8'}
            />
          </span>
        </BlockButton>
        <BlockButton format='block-quote'>
          <FontAwesomeIcon
            size='sm'
            icon={faQuoteRight}
          />
        </BlockButton>
        <BlockButton format='link'>
          <FontAwesomeIcon
            size='sm'
            icon={faLink}
            transform={'shrink-2'}
          />
        </BlockButton>
        
      </Group>

      <Group>
        <BlockButton format='bulleted-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListUl}
          />
        </BlockButton>
        <BlockButton format='numbered-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListOl}
          />
        </BlockButton>
        <BlockButton format='check-list'>
          <FontAwesomeIcon
            size='sm'
            icon={faListCheck}
          />
        </BlockButton>
      </Group>
    </Flex>
  )
})

export default TextEditorToolbar
import React, { useEffect, useMemo, useRef, useState }  from "react"
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate'
import { useSlate } from 'slate-react'
import { Box, Flex, IconButton, Select } from "@radix-ui/themes"
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

import { toggleTextBlock } from "@renderer/utils/slate"

/******************************************************************************
* Utils
******************************************************************************/

/*
const TEXT_TYPES = []
const isTextBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node: NodeType) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node.type === format,
    })
  )

  console.log('NODES', Array.from(Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
  })))
  console.log('MATCH', match, )

  return !!match
}

const toggleTextBlock = (editor, format) => {
  const isActive = isTextBlockActive(
    editor,
    format,
  )

  Transforms.unwrapNodes<NodeType>(editor, {
    match: (node: NodeType) => 
      !Editor.isEditor(node) &&
      SlateElement.isElement(node),
    split: true,
  })
  Transforms.setNodes<ElementType>(
    editor, { type: isActive ? 'paragraph' : format })
}
*/

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes<NodeType>(editor, {
    match: (node: NodeType) => 
      !Editor.isEditor(node) &&
      SlateElement.isElement(node),
    split: true,
  })
  let newProperties: Partial<ElementType>

  newProperties = {
    type: isActive ? 
      'paragraph' : 
      (isList ? 'list-item' : format),
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

const isBlockActive = (editor, format, attribute = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[attribute] === format,
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
  }
)

const ToolbarGroup = React.forwardRef((
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

const ToolbarTextWeightSelect = ({ editor }) => {
  const items: { 
    format: string, 
    label: string,
  }[] = useMemo(() => [
    { format: 'heading-one', label: 'Heading 1' },
    { format: 'heading-two', label: 'Heading 2' },
    { format: 'heading-three', label: 'Heading 3' },
    { format: 'paragraph', label: 'Normal' },
  ], [])
  const [state, setState] = useState({
    textWeight: 'paragraph'
  })

  useEffect(() => {
    const onSelectListener = (operation) => {
      console.log('SELECTION CHANGED')
    }
    editor.setOnOperationListener('set_selection', onSelectListener)
   return () => {
    editor.removeOnOperationListener('set_selection', onSelectListener)
   }
  }, [])

  const onTextWeightChange = (format) => {
    //console.log('CHANGE TEXT WEIGHT', format)
    toggleTextBlock(editor, format)
    setState((prev) => ({
      ...prev,
      textWeight: format
    }))
  }

  return (
    <Select.Root 
      defaultValue='paragraph'
      value={state.textWeight}
      onValueChange={onTextWeightChange}
    >
      <Select.Trigger variant='ghost'>
        <FontAwesomeIcon
          size='sm'
          icon={faHeader}
        />
      </Select.Trigger>
      <Select.Content variant='soft' >
        {
          items.map(item => (
            <Select.Item
              key={item.format}
              value={item.format}
            >
              {item.label}
            </Select.Item>
          ))
        }
      </Select.Content>
    </Select.Root>
  )
}

/******************************************************************************
* Renderer component
******************************************************************************/

const Toolbar = React.forwardRef(function (
  {
    ...flexProps
  }: FlexProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  const editor = useSlate()
  return (
    <Flex
      ref={ref}
      {...flexProps}
      direction='row'
      justify='start'
      align='center'
      gap='4'
    >
      <ToolbarGroup>
        <ToolbarTextWeightSelect editor={editor} />
      </ToolbarGroup>

      <ToolbarGroup>
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
      </ToolbarGroup>

      <ToolbarGroup>
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
        
      </ToolbarGroup>

      <ToolbarGroup>
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
      </ToolbarGroup>
    </Flex>
  )
})

export default Toolbar
import React, { useMemo, useCallback } from 'react'
import { createEditor, Descendant, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import TextEditorToolbar from '@renderer/components/TextEditorToolbar'

import type { DescendantType } from '@ts/slate.types'
import { Box, Card, Flex, ScrollArea } from '@radix-ui/themes'

const initialValue: DescendantType[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

function TextEditor () {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    <Box
      width='100%'
      height='100%'
      asChild={true}
    >
      <Card
        className='text-editor__frame'
        variant='surface'
      >
        <Slate editor={editor} initialValue={initialValue as Descendant[]}>
          <Flex
            width='100%'
            height='100%'
            direction='column'
            justify='start'
            align='stretch'
            gap='1'
          >
            <TextEditorToolbar />
            <Box
              className='scroll-area'
              minHeight='0'
              flexGrow='1'
              asChild={true}
              overflowX='clip'
              overflowY='auto'
            >
              <Editable 
                className='text-editor__content'
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Box>
          </Flex>
        </Slate>
      </Card>
    </Box>

  )
}

export default TextEditor

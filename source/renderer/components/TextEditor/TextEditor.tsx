import React, { useMemo, useCallback } from 'react'
import { Descendant, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { Box, Card, Flex } from '@radix-ui/themes'

import { widthAmberpadEditor } from '@renderer/utils/slate'
import TextEditorToolbar from '@renderer/components/TextEditor/Toolbar'

import type { DescendantType } from '@ts/slate.types'

const initialValue: DescendantType[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

/******************************************************************************
* Element rendering components
******************************************************************************/

const defaultElement = ({ attributes, children, element }) => (
  <p {...attributes}>
    {children}
  </p>
)

const TextWeights = ({ attributes, children, element }) => (
  {
    'heading-one' : (
      <h1 {...attributes}>
        {children}
      </h1>
    ),
    'heading-two': (
      <h2 {...attributes}>
        {children}
      </h2>
    ),
    'heading-three': (
      <h3 {...attributes}>
        {children}
      </h3>
    ),
    'text-normal': (
      <p {...attributes}>
        {children}
      </p>
    )
  }[element.type]
)

const Element = (props) => {
  const { element } = props;
  return {
    'heading-one': TextWeights(props),
    'heading-two': TextWeights(props),
    'heading-three': TextWeights(props),
    'text-normal': TextWeights(props),
  }[element.type] || 
  defaultElement(props)

  /*
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
  */
}

/******************************************************************************
* Leaf rendering components
******************************************************************************/

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

/******************************************************************************
* Render text editor
******************************************************************************/

function TextEditor () {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(widthAmberpadEditor(createEditor())), [])

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
        <Slate 
          editor={editor} 
          initialValue={initialValue as Descendant[]}
          //onChange={(value) => {
          //  console.log('EDITOR:', JSON.stringify(value, undefined, 2))
          //}}
        >
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

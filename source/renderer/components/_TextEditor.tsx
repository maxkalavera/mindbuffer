import React, { useCallback, useEffect, useRef } from 'react';
import Quill from 'quill'

import { Box, Flex, Reset, TextArea } from "@radix-ui/themes"
import TextEditorToolbar from './TextEditorToolbar';
import '@renderer/styles/quill.core.styl'
import '@renderer/styles/quill.dark.styl'

const toolbarOptions = [
  [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': 1 }, { 'header': 2 }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'background': [] }, { 'align': [] }, 'link', 'clean'],
];

function TextEditor () {
  const quillRef = useRef<Quill>()
  const containerRef = useRef<HTMLDivElement>()
  const editorRef = useRef<HTMLDivElement>()

  const usingReferences = useCallback(function* () {
    if (
      containerRef.current === undefined ||
      editorRef.current === undefined
    ) {
      return;
    }
    try {
      yield {
        container: containerRef.current,
        editor: editorRef.current,
      }
    } finally {}
  }, [
    containerRef.current,
    editorRef.current,
  ])

  useEffect(() => {
    for(const { editor } of usingReferences()) {
      quillRef.current = new Quill(editor, {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: 'snow'
      })
    }
    return () => {
      quillRef.current = undefined
      containerRef.current && 
        containerRef.current.querySelector('.ql-toolbar')?.remove()
    }
  }, [
    usingReferences
  ])

  return (
    <Flex
      width='100%'
      height='100%'
      data-testid='text-editor__container'
      ref={containerRef}
      direction='column'
      gap='0'
      justify='start'
      align='stretch'
    >
      <Box
        minHeight='0'
        flexGrow='1'
        width='100%'
        maxWidth='100%'
        className='rt-TextAreaRoot rt-r-size-2 rt-variant-surface'
        data-testid='text-editor__content'
        ref={editorRef}
      />
    </Flex>
  )
}

export default TextEditor
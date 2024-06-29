import {
  Editor,
  Transforms,
  Element as SlateElement,
  createEditor as _createEditor,
  BaseEditor,
  BaseOperation
} from 'slate'

import type { ElementType, NodeType, EditorType } from "@ts/slate.types"

/******************************************************************************
* Custom editor pluggin
******************************************************************************/

type OperationListener = (operation?: BaseOperation) => void
type OperationType = BaseOperation['type']

interface AmberpadEditor extends BaseEditor {
  setOnOperationListener: (type: OperationType, listener: OperationListener) => void
  removeOnOperationListener: (type: OperationType, listener: OperationListener) => void
}

export function widthAmberpadEditor<T extends BaseEditor> (
  editor: T
): T & AmberpadEditor {
  const e = editor as T & AmberpadEditor
  const listenersMap = new Map<OperationType, OperationListener[]>()

  e.onChange = ({ operation }) => {
    console.log('ON CHANGE()', operation)
    console.log(listenersMap)
    if (listenersMap.has(operation.type)) {
      const listeners = listenersMap.get(operation.type) as OperationListener[]
      listeners.forEach((listener) => listener(operation))
    }
  }

  e.setOnOperationListener = (type, listener) => {
    if (listenersMap.has(type)) {
      const listeners = listenersMap.get(type) as OperationListener[]
      listenersMap.set(type, [...listeners, listener])
    } else {
      listenersMap.set(type, [listener])
    }

  }

  e.removeOnOperationListener = (type, listener) => {
    let listeners = listenersMap.get(type) as OperationListener[]
    listeners = listeners.filter((item) => item !== listener)
    listenersMap.set(type, listeners)
  }

  return e
}

/******************************************************************************
* Custom Commands
******************************************************************************/

const TEXT_TYPES = []
export const isTextBlockActive = (editor, format) => {
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

  return !!match
}

export const toggleTextBlock = (editor, format) => {
  const isActive = isTextBlockActive(
    editor,
    format,
  )
  Transforms.setNodes<ElementType>(
    editor, { type: isActive ? 'paragraph' : format })
}
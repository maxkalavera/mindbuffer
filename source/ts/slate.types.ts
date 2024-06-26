import {
  BaseElement,
  BaseText,
  Editor,
} from 'slate'

export type DescendantType = ElementType | TextType

export interface ElementType extends BaseElement {
  type: string
  align?: 'left' | 'center' | 'right' | 'justify'
  children: DescendantType[]
}

export interface TextType extends BaseText {
  text: string
}


export type BaseNodeType = Editor | ElementType | TextType
export type NodeType = Editor | ElementType | TextType

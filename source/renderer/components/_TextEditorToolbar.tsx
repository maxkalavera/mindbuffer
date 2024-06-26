import { Box, Flex, Select } from '@radix-ui/themes';
import React, { useCallback, useEffect, useRef } from 'react';

import type { FlexProps } from '@radix-ui/themes';

function TextEditorToolbar (
  {
    ...flexProps
  }: FlexProps
) {
  return (
    <Flex
      {...flexProps}
    >
      <select 
        className="ql-size"
      >
        <option value="small">Small</option>
        <option value={undefined}>Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
    </Flex>
  )
}

export default TextEditorToolbar
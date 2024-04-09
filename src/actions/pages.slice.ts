import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Page } from '@ts/models/Pages.types'

export interface PagesSliceState {
  values: Page[],
  page: number,
  hasNextPage: boolean,
  insertedTopHash: number,
  insertedBottomHash: number,
}

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    insertedTopHash: 0,
    insertedBottomHash: 0,
  } as PagesSliceState,
  reducers: {
  },
  extraReducers: (builder) => {
  }
})

export default pagesSlice
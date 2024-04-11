import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Page } from '@ts/models/Pages.types'

export interface PagesSliceState {
}

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
  } as PagesSliceState,
  reducers: {
  },
  extraReducers: (builder) => {
  }
})

export default pagesSlice
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { PageID } from '@ts/models/Pages.types'

interface NotesSliceState {
  search: string,
  selectedPageID: PageID,
  isSidebarOpen: boolean,
  sidebarToggleHash: number,
}

function setSearch (
  state: NotesSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.search = action.payload.value
}

function setSelectedPageID(
  state: NotesSliceState, 
  action: PayloadAction<{ value: PageID }>
) {
  state.selectedPageID = action.payload.value
}

function setIsSidebarOpen (
  state: NotesSliceState, 
  action: PayloadAction<{ value: boolean }>
) {
  state.isSidebarOpen = action.payload.value
}

function mutateSidebarToggleHash (
  state: NotesSliceState,
) {
  state.sidebarToggleHash += 1
}

const commonsSlice = createSlice({
  name: 'commons',
  initialState: {
    search: '',
    isSidebarOpen: true,
    sidebarToggleHash: 0,
  } as NotesSliceState,
  reducers: {
    setSearch,
    setSelectedPageID,
    setIsSidebarOpen,
    mutateSidebarToggleHash,
  },
  extraReducers: (builder) => {}
})

export default commonsSlice
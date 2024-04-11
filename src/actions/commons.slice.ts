import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface NotesSliceState {
  search: string,
  isSidebarOpen: boolean,
  sidebarToggleHash: number,
  platform: string,
}

function setSearch (
  state: NotesSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.search = action.payload.value
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
    platform: '',
  } as NotesSliceState,
  reducers: {
    setSearch,
    setIsSidebarOpen,
    mutateSidebarToggleHash,
  },
  extraReducers: (builder) => {}
})

export default commonsSlice
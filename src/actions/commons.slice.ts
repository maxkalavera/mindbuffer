import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface NotesSliceState {
  search: string,
  noteInput: string,
  isSidebarOpen: boolean,
}

function setSearch (
  state: NotesSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.search = action.payload.value
}

function setNoteInput (
  state: NotesSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.noteInput = action.payload.value
}

function setIsSidebarOpen (
  state: NotesSliceState, 
  action: PayloadAction<{ value: boolean }>
) {
  state.isSidebarOpen = action.payload.value
}

const commonsSlice = createSlice({
  name: 'commons',
  initialState: {
    search: '',
    noteInput: '',
    isSidebarOpen: true,
  } as NotesSliceState,
  reducers: {
    setSearch,
    setNoteInput,
    setIsSidebarOpen,
  },
})

export default commonsSlice
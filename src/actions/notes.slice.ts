import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { NotePayload, Note, NoteID } from "@ts/models/Notes.types"

export interface NotesSliceState {
  values: Note[],
  page: number,
  hasNextPage: boolean,
  insertedTopHash: number,
  insertedBottomHash: number,
}

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (payload: { page: number, search: string}, thunkAPI) => {
    const response = await window.electronAPI.notes.getAll({
      page: payload.page,
      search: payload.search
    })
    if (thunkAPI.signal.aborted)
      throw new Error('stop the work, this has been aborted!')
    return {
      page: payload.page,
      values: response
    }
  },
)

export const searchNotes = createAsyncThunk(
  'notes/searchNotes',
  async (payload: { search: string }, thunkAPI) => {
    const response = await window.electronAPI.notes.getAll({
      page: 1,
      search: payload.search
    })
    if (thunkAPI.signal.aborted)
      throw new Error('stop the work, this has been aborted!')
    return {
      page: 1,
      values: response
    }
  },
)

function set (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = action.payload.values
}

function addTop (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = 
    [...action.payload.values, ...state.values]
  state.insertedTopHash += 1
}

function addBotom (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
    state.insertedBottomHash += 1
}


function update (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = state.values.map((item) => 
    action.payload.values.find((paylodItem) => paylodItem.id === item.id) || 
    item
  )
}

function destroy (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = state.values.filter((item) =>
    !action.payload.values.some((payloadItem) => payloadItem.id === item.id)
  )
}

function increasePagination (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.page += 1
}

function resetPagination (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.page = 1
}

function setNextPage (
  state: NotesSliceState, 
  action: PayloadAction<{ value: boolean }>
) {
  state.hasNextPage = action.payload.value
}

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    insertedTopHash: 0,
    insertedBottomHash: 0,
  } as NotesSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
    increasePagination,
    resetPagination,
    setNextPage,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      addTop(
        state, 
        {
          ...action, 
          payload: {
            ...action.payload,
            values: action.payload.values.reverse()
          }
        }
      )
      state.page = action.payload.page
      if (action.payload.values.length === 0) {
        state.hasNextPage = false
      }
    })
    builder.addCase(searchNotes.fulfilled, (state, action) => {
      state.values = action.payload.values.reverse()
      state.page = 1
      state.hasNextPage = true
      state.insertedBottomHash += 1
    })
  }
})

export default notesSlice
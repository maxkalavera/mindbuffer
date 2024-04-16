import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Note, NotePayload } from "@ts/models/Notes.types"

export interface NotesSliceState {
  values: Note[],
  page: number,
  hasNextPage: boolean,
  adjustScrollHash: number,
  scrollBeginingHash: number,
  loading: boolean,
}

export const fetchNotesThunk = createAsyncThunk(
  'notes/fetchNotes',
  async (payload: { page: number, search: string}, thunkAPI) => {
    const response = await window.electronAPI.notes.getAll({
      page: payload.page,
      search: payload.search
    })

    if (thunkAPI.signal.aborted)
      throw '27b4ebe0-9da8-447d-9c1c-9f1e8079784f'

    if (response === undefined)
      throw 'fc9a41ad-b038-42f9-b83a-7a78f3ef226e'

    return {
      ...response,
      page: payload.page,
    }
  },
)

export const searchNotesThunk = createAsyncThunk(
  'notes/searchNotes',
  async (payload: { search: string }, thunkAPI) => {
    const response = await window.electronAPI.notes.getAll({
      page: 1,
      search: payload.search
    })

    if (thunkAPI.signal.aborted)
      throw 'ed7f98e2-57ed-43f2-bd95-c577405c27da'

    if (response === undefined)
      throw 'db30e09f-40d0-48f2-8b6a-6c9605174ff8'

    return {
      ...response,
      page: 1,
    }
  },
)

export const createNoteThunk = createAsyncThunk(
  'notes/createNote',
  async (payload: NotePayload, thunkAPI) => {
    const response = await window.electronAPI.notes.create({
      data: [payload]
    })

    if (thunkAPI.signal.aborted)
      throw '2e9c0acb-722b-42b7-b9e2-144222e8811d'

    if (response === undefined)
      throw 'cf788430-1b98-4dd4-9dd0-6ed963216080'

    return response
  },
)

export const updateNoteThunk = createAsyncThunk(
  'notepads/updateNote',
  async (payload: { value: Note }, thunkAPI) => {
    const response = await window.electronAPI.notes.update(payload)

    if (thunkAPI.signal.aborted)
      throw '8429c2e4-cdba-48d6-bcf1-c8258cc6ad79'

    if (response === undefined)
      throw '14c01fd9-677a-4c24-be60-a046cfea6e1c'

    return response
  },
)

export const destroyNoteThunk = createAsyncThunk(
  'notes/destroyNote',
  async (payload: { value: Note }, thunkAPI) => {
    const response = await window.electronAPI.notes.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw '213b4d4f-38f3-40e6-be9f-2b4f9220696b'

    if (response === undefined)
      throw 'd729bde1-aca9-4551-9c83-2d1377cd4d7a'

    return payload
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
  state.adjustScrollHash += 1
}

function addBotom (
  state: NotesSliceState, 
  action: PayloadAction<{ values: Note[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
    state.scrollBeginingHash += 1
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

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    adjustScrollHash: 0,
    scrollBeginingHash: 0,
    loading: false,
  } as NotesSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotesThunk.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(fetchNotesThunk.fulfilled, (state, action) => {
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
      state.loading = false
      state.page = action.payload.page
      if (action.payload.values.length === 0) {
        state.hasNextPage = false
      }
    })
    builder.addCase(searchNotesThunk.fulfilled, (state, action) => {
      state.values = action.payload.values.reverse()
      state.page = 1
      state.hasNextPage = true
      state.scrollBeginingHash += 1
    })
    builder.addCase(createNoteThunk.fulfilled, (state, action) => {
      addBotom(state, {...action, payload: { values: action.payload.values }})
      state.scrollBeginingHash += 1
    })
    builder.addCase(updateNoteThunk.fulfilled, (state, action) => {
      addBotom(state, {...action, payload: { values: [action.payload.value] }})
      state.scrollBeginingHash += 1
    })
    builder.addCase(destroyNoteThunk.fulfilled, (state, action) => {
      destroy(state, {...action, payload: { values: [action.payload.value] }})
    })
  }
})

export default notesSlice
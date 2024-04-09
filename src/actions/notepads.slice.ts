import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Notepad, NotepadPayload } from '@ts/models/Notepads.types'

export interface NotepadsSliceState {
  values: Notepad[],
  page: number,
  hasNextPage: boolean,
  insertedTopHash: number,
  insertedBottomHash: number,
}

export const fetchNotepadsThunk = createAsyncThunk(
  'notepads/fetchNotepads',
  async (payload: { page: number, search: string}, thunkAPI) => {
    const response = await window.electronAPI.notepads.getAll({
      page: payload.page,
      search: payload.search
    })

    if (thunkAPI.signal.aborted)
      throw 'b2c2e61b-aceb-4750-ac89-6e91e26c7b44'

    if (response === undefined)
      throw 'a2ac27ee-822b-4332-979b-34533f6fc001'

    return {
      page: payload.page,
      values: response
    }
  },
)

export const searchNotepadsThunk = createAsyncThunk(
  'notepads/searchNotepads',
  async (payload: { search: string }, thunkAPI) => {
    const response = await window.electronAPI.notepads.getAll({
      page: 1,
      search: payload.search
    })

    if (thunkAPI.signal.aborted)
      throw '633399db-51e1-48df-9c85-b34bc8f84b5c'

    if (response === undefined)
      throw '7e1d69f0-fb9b-4132-93ad-af312bdae8b8'

    return {
      page: 1,
      values: response
    }
  },
)

export const createNotepadThunk = createAsyncThunk(
  'notepads/createNotepad',
  async (payload: NotepadPayload, thunkAPI) => {
    const response = await window.electronAPI.notepads.create({
      data: payload
    })

    if (thunkAPI.signal.aborted)
      throw '633399db-51e1-48df-9c85-b34bc8f84b5c'

    if (response === undefined)
      throw '7e1d69f0-fb9b-4132-93ad-af312bdae8b8'

    return response
  },
)

export const updateNotepadThunk = createAsyncThunk(
  'notepads/updateNotepad',
  async (payload: { value: Notepad }, thunkAPI) => {
    const response = await window.electronAPI.notepads.update(payload)

    if (thunkAPI.signal.aborted)
      throw 'edcb2bd6-6314-403d-aa98-5847a90c2fbd'

    if (response === undefined)
      throw '42b47d00-4e6c-440d-9827-3a83da2c42a0'

    return response
  },
)

export const destroyNotepadThunk = createAsyncThunk(
  'notepads/createNotepads',
  async (payload: { value: Notepad }, thunkAPI) => {
    const response = await window.electronAPI.notepads.destroy({
      id: payload.value.id
    })

    if (thunkAPI.signal.aborted)
      throw 'c3b86706-cb9e-4c35-97f5-20dd02272f4f'

    if (response === undefined)
      throw 'c5a0dde9-2a0b-4833-9f43-80ba41fdb4ef'

    return response
  },
)

function set (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = action.payload.values
}

function addTop (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = 
    [...action.payload.values, ...state.values]
  state.insertedTopHash += 1
}

function addBotom (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
    state.insertedBottomHash += 1
}


function update (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = state.values.map((item) => 
    action.payload.values.find((paylodItem) => paylodItem.id === item.id) || 
    item
  )
}

function destroy (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = state.values.filter((item) =>
    !action.payload.values.some((payloadItem) => payloadItem.id === item.id)
  )
}

const notepadsSlice = createSlice({
  name: 'notepads',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    insertedTopHash: 0,
    insertedBottomHash: 0,
  } as NotepadsSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotepadsThunk.fulfilled, (state, action) => {
      addBotom(
        state, 
        {
          ...action, 
          payload: {
            ...action.payload,
            values: action.payload.values
          }
        }
      )
      state.page = action.payload.page
      if (action.payload.values.length === 0) {
        state.hasNextPage = false
      }
    })
    builder.addCase(searchNotepadsThunk.fulfilled, (state, action) => {
      state.values = action.payload.values
      state.page = 1
      state.hasNextPage = true
      state.insertedBottomHash += 1
    })
  }
})

export default notepadsSlice
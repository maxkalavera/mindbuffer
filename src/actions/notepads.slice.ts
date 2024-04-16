import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Page, PagePayload } from '@src/ts/models/Pages.types'
import type { Notepad, NotepadID, NotepadPayload } from '@ts/models/Notepads.types'

export interface NotepadsSliceState {
  values: Notepad[],
  page: number,
  hasNextPage: boolean,
  adjustScrollHash: number,
  scrollBeginingHash: number,
  loading: boolean,
  paginationMap: {[key: NotepadID] : {
    page: number,
    hasNext: boolean,
    isLoading: boolean,
    hash: number,
  }},
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
      ...response,
      page: payload.page,
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

    return response
  },
)

export const createNotepadThunk = createAsyncThunk(
  'notepads/createNotepad',
  async (payload: NotepadPayload, thunkAPI) => {
    const response = await window.electronAPI.notepads.create({
      data: [payload]
    })

    if (thunkAPI.signal.aborted)
      throw 'a82f160b-84a3-4194-a10c-19dd2f71818b'

    if (response === undefined)
      throw '7123211a-9d4e-4fab-8162-add400383760'

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
  'notepads/destroyNotepad',
  async (payload: { value: Notepad }, thunkAPI) => {
    const response = await window.electronAPI.notepads.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw 'c3b86706-cb9e-4c35-97f5-20dd02272f4f'

    if (response === undefined)
      throw 'c5a0dde9-2a0b-4833-9f43-80ba41fdb4ef'

    return payload
  },
)

export const createpageThunk = createAsyncThunk(
  'notes/createPage',
  async (payload: PagePayload, thunkAPI) => {
    const response = await window.electronAPI.pages.create({
      data: [payload]
    })

    if (thunkAPI.signal.aborted)
      throw 'b8c3fbcc-4191-48c2-a851-ab771baebbf9'

    if (response === undefined)
      throw '5cd24616-dd8e-442d-8d68-9b4cba2cb7d8'

    return response
  },
)

export const updatePageThunk = createAsyncThunk(
  'notepads/updatePage',
  async (payload: { value: Page }, thunkAPI) => {
    const response = await window.electronAPI.pages.update(payload)

    if (thunkAPI.signal.aborted)
      throw '30435104-425f-4a6f-957e-baebd8321566'

    if (response === undefined)
      throw '7d03ef8f-3598-4347-a6b9-1bb19bc0b08c'

    return response
  },
)

export const destroyPageThunk = createAsyncThunk(
  'notes/destroyPage',
  async (payload: { value: Page }, thunkAPI) => {
    const response = await window.electronAPI.pages.destroy({
      value: payload.value
    })

    if (thunkAPI.signal.aborted)
      throw '0442526a-6711-48c7-b914-e339ac044665'

    if (response === undefined)
      throw '6bfc3aed-7eec-49b5-85eb-cde0524454b8'

    return payload
  },
)

export const fetchPagesThunk = createAsyncThunk(
  'notepads/fetchPages',
  async (
    payload: { 
      notepads: NotepadID[], 
      search: string,
    }, 
    thunkAPI
  ) => {
    const state = (thunkAPI.getState() as any).notepads as NotepadsSliceState
    const response = await window.electronAPI.pages.getAll({
      notepads: payload.notepads.map((notepadID) => ({
        id: notepadID,
        page: state.paginationMap[notepadID] ?
          state.paginationMap[notepadID].page :
          2
      })),
      search: '',
    })

    if (thunkAPI.signal.aborted)
      throw 'b2c2e61b-aceb-4750-ac89-6e91e26c7b44'

    if (response === undefined)
      throw 'a2ac27ee-822b-4332-979b-34533f6fc001'

    return {
      notepads: response,
    }
  },
)

function set (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = action.payload.values
  state.paginationMap = {}
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: true,
      isLoading: false,
      hash: 0,
    }
  })
}

function addTop (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = 
    [...action.payload.values, ...state.values]
  state.adjustScrollHash += 1
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: false,
      isLoading: false,
      hash: 0,
    }
  })
}

function addBotom (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Notepad[] }>
) {
  state.values = 
    [...state.values, ...action.payload.values]
  state.scrollBeginingHash += 1
  // For pages pagination
  action.payload.values.forEach(notepad => {
    state.paginationMap[notepad.id] = {
      page: 1,
      hasNext: true,
      isLoading: false,
      hash: 0,
    }
  })
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
  // For pages pagination
  action.payload.values.forEach(notepad => {
    delete state.paginationMap[notepad.id]
  })
}

function addPages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Page[] }>
) {
  state.values = state.values.map((item) => {
    const payloadItem = action.payload.values.find((payloadItem) => payloadItem.notepadId === item.id)
    return {
      ...item,
      pages: payloadItem ? [...item.pages, payloadItem] : item.pages
    }
  })
}

function updatePages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Page[] }>
) {
  state.values = state.values.map((notepad) => {
    const page = action.payload.values.find((page) => page.notepadId === notepad.id)
    if (page) {
      notepad.pages = notepad.pages.map((item) => item.id === page.id ? page : item)
    }
    return notepad
  })
}

function destroyPages (
  state: NotepadsSliceState, 
  action: PayloadAction<{ values: Page[] }>
) {
  state.values = state.values.map((notepad) => {
    const page = action.payload.values.find((page) => page.notepadId === notepad.id)
    if (page) {
      notepad.pages = notepad.pages.filter((item) => item.id !== page.id)
    }
    return notepad
  })
}

const notepadsSlice = createSlice({
  name: 'notepads',
  initialState: {
    values: [],
    page: 1,
    hasNextPage: true,
    adjustScrollHash: 0,
    scrollBeginingHash: 0,
    loading: false,
    paginationMap: {},
  } as NotepadsSliceState,
  reducers: {
    set,
    addTop,
    addBotom,
    update,
    destroy,
    addPages,
    updatePages,
    destroyPages,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotepadsThunk.pending, (state, action) => {
      state.loading = true
    })
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
      state.loading = false
      state.page = action.payload.page
      if (action.payload.values.length === 0) {
        state.hasNextPage = false
      }
    })
    builder.addCase(searchNotepadsThunk.fulfilled, (state, action) => {
      state.values = action.payload.values
      state.page = 1
      state.hasNextPage = true
      state.scrollBeginingHash += 1
    })
    builder.addCase(createNotepadThunk.fulfilled, (state, action) => {
      addTop(state, {...action, payload: { values: action.payload.values }})
    })
    builder.addCase(updateNotepadThunk.fulfilled, (state, action) => {
      update(state, {...action, payload: { values: [action.payload.value] }})
    })
    builder.addCase(destroyNotepadThunk.fulfilled, (state, action) => {
      destroy(state, { ...action, payload:{ values: [action.payload.value] } })
    })
    // Extra reducers for pages
    builder.addCase(createpageThunk.fulfilled, (state, action) => {
      addPages(state, {...action, payload: { values: action.payload.values }})
    })
    builder.addCase(updatePageThunk.fulfilled, (state, action) => {
      updatePages(state, {...action, payload: { values: [action.payload.value] }})
    })
    builder.addCase(destroyPageThunk.fulfilled, (state, action) => {
      destroyPages(state, { ...action, payload:{ values: [action.payload.value] } })
    })
    builder.addCase(fetchPagesThunk.pending, (state, action) => {
      action.meta.arg.notepads.forEach((notepadID) => {
        state.paginationMap[notepadID].page += 1
        state.paginationMap[notepadID].isLoading = true
      })
    })
    builder.addCase(fetchPagesThunk.fulfilled, (state, action) => {
      // Add received pages to every fetched notepad
      action.payload.notepads.values.forEach((payloadNotepad) => {
        const notepad = state.values.find((notepad) => notepad.id === payloadNotepad.notepadId)
        notepad.pages = [...notepad.pages, ...payloadNotepad.pages]
      })
      // Set loading of pagination for every notepad to false
      action.meta.arg.notepads.forEach((notepadID) => {
        state.paginationMap[notepadID].isLoading = false
        state.paginationMap[notepadID].hash += 1
      })
    })
  }
})

export default notepadsSlice
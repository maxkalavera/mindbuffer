import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CommonsSliceState {
  search: string,
  isSidebarOpen: boolean,
  sidebarToggleHash: number,
}

export const commonsSliceInitials: CommonsSliceState = {
  search: '',
  isSidebarOpen: false,
  sidebarToggleHash: 0,
}

function setSearch (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: string }>
) {
  state.search = action.payload.value
}

function setIsSidebarOpen (
  state: CommonsSliceState, 
  action: PayloadAction<{ value: boolean }>
) {
  state.isSidebarOpen = action.payload.value
}

function mutateSidebarToggleHash (
  state: CommonsSliceState,
) {
  state.sidebarToggleHash += 1
}

const commonsSlice = createSlice({
  name: 'commons',
  initialState: commonsSliceInitials,
  reducers: {
    setSearch,
    setIsSidebarOpen,
    mutateSidebarToggleHash,
  },
  extraReducers: (builder) => {}
})

export default commonsSlice
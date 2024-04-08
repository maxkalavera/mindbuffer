import { useMemo } from 'react'
import _ from 'lodash'
import { createSlice, configureStore } from '@reduxjs/toolkit'

import notesSlice from '@actions/notes.slice'
import commonsSlice from '@actions/commons.slice'

const store = configureStore({
  reducer: {
    notes: notesSlice.reducer,
    commons: commonsSlice.reducer,
  },
})

function monitor (
  extract: (state: ReturnType<typeof store.getState>) => any,
  callBack: (state: ReturnType<typeof store.getState>) => void
) {
  const last: {current: any} = {current: undefined}
  store.subscribe(() => {
    const state = store.getState()
    const values = extract(state)
    if (!_.isEqual(last.current, values)) {
      last.current = values
      callBack(state)
    }
  })
}

// @ts-ignore
store.monitor = monitor

export default store as typeof store & { 
  monitor: typeof monitor
}

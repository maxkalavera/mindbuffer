import equal from 'fast-deep-equal'
import { configureStore } from '@reduxjs/toolkit'

import commonsSlice from '@renderer/actions/commons.slice'
import notesSlice from '@renderer/actions/notes.slice'
import notepadsSlice from '@renderer/actions/notepads.slice'
import pagesSlice from '@renderer/actions/pages.slice'

const store = configureStore({
  reducer: {
    notes: notesSlice.reducer,
    commons: commonsSlice.reducer,
    notepads: notepadsSlice.reducer,
    pages: pagesSlice.reducer,
  },
})

function monitor (
  extract: (state: ReturnType<typeof store.getState>) => any,
  callBack: (state: ReturnType<typeof store.getState>) => void,
) {
  const last: {current: any} = {current: undefined}
  store.subscribe(() => {
    const state = store.getState()
    const values = extract(state)
    if (!equal(last.current, values)) {
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

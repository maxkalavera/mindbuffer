import _ from 'lodash'
import { useEffect, useRef, useState } from "react"

type state = {[key: string]: any}

export default function useAsyncReducer<T = any>(
  actions: {[key: string]: (state: T, payload: any) => T | Promise<T>},
    initState: T
  ) {

    

}

/*
export default function useAsyncReducer<T = any>(
  actions: {[key: string]: (state: T, payload: any) => T | Promise<T>},
    initState: T
  ) {
  const [state, setState] = useState<T>(initState)
  const dispatchRef = useRef(async (action: {type: string, payload?: any}) => {
    let actionFunction
    try {
      actionFunction = actions[action.type]//await actionsRef.current[action.type]
      if (actionFunction === undefined) {
        console.error(`Action undefined: (${action.type})`)
        return
      }
    } catch (error) {
      console.error(error)
      return
    }

    try {
      setState(async (prevState) => {
        console.log('SET STATE ASYNC')
        return prevState
        //return await actionFunction(prevState, action.payload)
      })
    } catch (error) {
      console.error(error)
    }
  })

  console.log('ASYNC REDUCER STATE', state)
  return [state, (action: {type: string, payload?: any}) => {
    dispatchRef.current(action)
  }]
}
*/
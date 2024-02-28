import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from '@pages/Home'

export default function Router () {
  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route 
            path="/"
            element={<Home />}
          />
      </Routes>
    </HashRouter>
  )
}

import {RouterProvider} from "react-router-dom";

import {route} from "./router";

function App() {

  return (
    <>
    <RouterProvider router={route}></RouterProvider>
    </>
  )
}

export default App

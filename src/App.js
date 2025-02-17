import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
import NotFound from './pages/NotFound'
import OrderList from './pages/OrderList'
import { ToastContainer } from "react-toastify";
import Create from './pages/Create'
import Home from './pages/Home'

// const PublicRoute = () => {
//   const a = 0;

//   {
//     a == 0 ?
//       <>
//         <Navigate to='/' />
//       </>
//       :
//       <Navigate to='/not-found' />
//   }

// }


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          
          <Route  path='/' element={<Home />} />
          <Route path='/create' element={<Create />} />
          <Route  path='/orderlist/:id' element={<OrderList/>} />

          <Route element={<NotFound />} path='/not-found' />
          <Route path='*' element={<Navigate to="/" />} />
           {/* <Route element={<NotFound />} path='*' /> */}
          {/* <Navigate to="not-found" /> */}
        </Routes>



      </Router>
      <ToastContainer />

    </>

  )
}

export default App
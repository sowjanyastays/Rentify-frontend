import React from 'react'
import { Routes, Route} from 'react-router-dom'
import LoginComponent from '../LoginComponent/LoginComponent'
import HomeComponent from '../HomeComponent/HomeComponent'
import RentalDetails from '../RentalDetails/RentalDetails'
import EditComponent from '../EditComponent/EditComponent'

function Router() {
  return (
   <Routes>
      <Route path='/login' element={<LoginComponent/>}/>
      <Route path='/' element={< HomeComponent/>}/>
      <Route path='/rentalDetails/:rentalId' element={<RentalDetails />} />
      <Route path='/editRentalDetails' element={<EditComponent />}/>
    </Routes>
  )
}

export default Router

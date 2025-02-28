import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './Pages/Login';
import User from './Pages/User/User.jsx';
import AddUser from './Pages/User/addUser.jsx';
import EditUser from './Pages/User/editUser.jsx';
import { AuthContext } from './context/AuthContext.jsx';
import Contact from './Pages/Contact/Contact.jsx';
import AddContact from './Pages/Contact/AddContact.jsx';
import EditContact from './Pages/Contact/editContact.jsx';
import AddCustomer from './Pages/Contact/addCustomer.jsx';
import EditCustomer from './Pages/Contact/editCustomer.jsx';
import CustomerDetail from './Pages/Contact/CustomerDetail.jsx';
import AddLeave from './Pages/Leave/addLeave.jsx';
import Leave from './Pages/Leave/Leave.jsx';
import EditLeave from './Pages/Leave/editLeave.jsx';
import AddOpportunity from './Pages/Opportunity/AddOpportunity1.jsx';
import Opportunity from './Pages/Opportunity/Opportunity.jsx';
import EditOpportunity from './Pages/Opportunity/editOpportunity.jsx';
import ViewOpportunity from './Pages/Opportunity/viewOpportunity.jsx';
import Alert from './Pages/Alert/Alert.jsx';
import PO from './Pages/PO/PO.jsx';
import Summary from './Pages/Summary/Summary.jsx';
import CustomerDetailVeiw from './Pages/Opportunity/CustomerDetailVeiw.jsx';
import SummaryCustomerDetailVeiw from './Pages/Summary/SummaryCustomerDetailVeiw.jsx';
import ProtectedRoute from './Pages/ProtectedRoute.jsx';
import Unauthorized from './Pages/Unauthorized.jsx';
import Calender from './Pages/Calender/Calender.jsx';
import ViewLeave from './Pages/Leave/ViewLeave.jsx';
import AddEmployes from './Pages/Employes/addEmployes.jsx';
import Employes from './Pages/Employes/Employes.jsx';
import EditEmployes from './Pages/Employes/edit.jsx';
import Register from './Pages/Register.jsx';
import ForgetPassword from './Pages/ForgetPassword.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import MobileLeave from './Pages/Leave/mobileLeave.jsx';
import { useMediaQuery } from 'react-responsive';
import Profile from './Pages/Profile/profile.jsx';
import Game from './Pages/EasterEgg/game.jsx';

function App() {
  const { currentUser } = useContext(AuthContext);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            currentUser ? (
              currentUser.role === 'admin' || currentUser.role === 'moderator' ? (
                <Navigate to='/Customer' />
              ) : (
                <Navigate to='/Leave' />
              )
            ) : (
              <Login />
            )
          }
        />
        
        <Route path='/user' element={<ProtectedRoute adminOnly><User /></ProtectedRoute>} />
        <Route path='/user/edit/:id' element={<ProtectedRoute adminOnly><EditUser /></ProtectedRoute>} />
        <Route path='/adduser' element={<ProtectedRoute adminOnly><AddUser /></ProtectedRoute>} />
        <Route path='/Customer' element={<ProtectedRoute adminMod><Contact /></ProtectedRoute>} />
        <Route path='/Summary' element={<ProtectedRoute adminMod ><Summary /></ProtectedRoute>} />
        <Route
  path='/Leave'
  element={
    <ProtectedRoute>
      {isMobile ? <MobileLeave /> : <Leave />}
    </ProtectedRoute>
  }
/>
        <Route path='/Alert' element={<ProtectedRoute adminMod ><Alert /></ProtectedRoute>} />
        <Route path='/Opportunity' element={<ProtectedRoute adminMod><Opportunity /></ProtectedRoute>} />
        <Route path='/PO' element={<ProtectedRoute adminMod><PO /></ProtectedRoute>} />
        <Route path='/addExpense' element={<ProtectedRoute adminMod><AddContact /></ProtectedRoute>} />
        <Route path='/addCustomer' element={<ProtectedRoute adminMod><AddCustomer /></ProtectedRoute>} />
        <Route path='/addLeave' element={<ProtectedRoute><AddLeave /></ProtectedRoute>} />
        <Route path='/addOpportunity' element={<ProtectedRoute adminMod ><AddOpportunity /></ProtectedRoute>} />
        <Route path='/Expense/edit/:id' element={<ProtectedRoute adminMod><EditContact /></ProtectedRoute>} />
        <Route path='/Opportunity/view/:id' element={<ProtectedRoute adminMod><ViewOpportunity /></ProtectedRoute>} />
        <Route path='/Customer/edit/:id' element={<ProtectedRoute adminMod><EditCustomer /></ProtectedRoute>} />
        <Route path='/Leave/edit/:id' element={<ProtectedRoute><EditLeave /></ProtectedRoute>} />
        <Route path='/Leave/view/:id' element={<ProtectedRoute><ViewLeave /></ProtectedRoute>} />
        <Route path='/Opportunity/edit/:id' element={<ProtectedRoute adminMod ><EditOpportunity /></ProtectedRoute>} />
        <Route path='/Customer/view/:id' element={<ProtectedRoute adminMod><CustomerDetailVeiw /></ProtectedRoute>} />
        <Route path='/Summary/view/:id' element={<ProtectedRoute adminMod><SummaryCustomerDetailVeiw /></ProtectedRoute>} />
        <Route path='/Customer/:id' element={<ProtectedRoute adminMod><CustomerDetail /></ProtectedRoute>} />
        <Route path='/Calendar' element={<ProtectedRoute ><Calender /></ProtectedRoute>} />
        <Route path='/Employees' element={<ProtectedRoute adminOnly><Employes /></ProtectedRoute>} />
        <Route path='/Employees/edit/:id' element={<ProtectedRoute adminOnly><EditEmployes /></ProtectedRoute>} />
        <Route path='/addEmployees' element={<ProtectedRoute adminOnly><AddEmployes /></ProtectedRoute>} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgetPassword' element={<ForgetPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
        <Route path='/Profile' element={<ProtectedRoute ><Profile /></ProtectedRoute>} />
        <Route path='/game' element={<ProtectedRoute ><Game /></ProtectedRoute>} />
      </Routes>

      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </>
  );
}

export default App;

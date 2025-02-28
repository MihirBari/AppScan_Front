import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import img1 from "../assets/User.png";

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className='flex items-center cursor-pointer' onClick={logout}>
      <img src={img1} alt='' className='mr-2' />
      <span style={{marginLeft:"13px"}} className='logout'>Logout</span>
    </div>
  );
}

export default Logout;

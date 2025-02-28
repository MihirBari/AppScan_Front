import React from 'react';
import SideNavBar from '../Sidebar/Navbar';
import Main from './main.jsx';  // Assuming that 'maiin' is a component and not a typo

const Profile = () => {
  return (
    <div className="flex h-screen overflow-hidden">
    <SideNavBar />
    <div className="flex-1 overflow-x-hidden overflow-y-auto">
      <Main />
    </div>
  </div>
  );
}

export default Profile;

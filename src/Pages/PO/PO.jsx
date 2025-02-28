import React, { useState, useEffect } from 'react';
import SideNavBar from '../Sidebar/Navbar';
import Maiin from './maiin';
import HiddenPo from './hiddenPo.jsx';

const PO = () => {
  // Retrieve the saved state from localStorage or default to false
  const [showHiddenPo, setShowHiddenPo] = useState(() => {
    const savedState = localStorage.getItem('showHiddenPo');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('showHiddenPo', JSON.stringify(showHiddenPo));
  }, [showHiddenPo]);

  // Toggle the display of HiddenPo component
  const handleToggleHiddenPo = () => {
    setShowHiddenPo((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavBar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleToggleHiddenPo}
          >
            {showHiddenPo ? 'Back to PO List' : 'Show Hidden PO'}
          </button>
        </div>

        {showHiddenPo ? <HiddenPo /> : <Maiin />}
      </div>
    </div>
  );
};

export default PO;

import React from 'react';

export const  Footer = () =>{
  return (
    <footer style={footerStyle}>
      <p>&copy; Powered By Techsa Services Pvt. Ltd.</p>
    </footer>
  );
}

const footerStyle = {
  backgroundColor: '#000',
  color: '#fff',
  textAlign: 'center',
  padding: '10px',
};
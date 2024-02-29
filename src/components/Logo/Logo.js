import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="ma4">
      <Tilt
        style={{ height: '100px', width: '100px' }}
        className="Tilt"
        tiltReverse="true"
      >
        <div
          className="br2 shadow-2 pa3"
          style={{
            height: '100px',
            width: '100px',
            backgroundColor: 'darkgreen',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;

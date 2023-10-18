import React from 'react';
import LogoLight from '../Images/LogoLight.svg';
import LogoDark from '../Images/LogoDark.svg';

const Logo = ({ darkTheme }) => {
    return (
      <img
        src={darkTheme ? LogoDark : LogoLight}
        alt="Logo company"
      />
    );
  };

export default Logo;

import React from 'react';
import LogoLight from '../Images/LogoLight.svg';
import LogoDark from '../Images/LogoDark.svg';

const Logo = ({ darkTheme }) => {
    return (
      <a href="/Team-Chat">
      <img
        src={darkTheme ? LogoDark : LogoLight}
        alt="Logo company"
      />
      </a>
    );
  };

export default Logo;

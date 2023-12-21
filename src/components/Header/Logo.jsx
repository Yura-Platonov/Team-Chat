import React from 'react';
import { Link } from 'react-router-dom';
import LogoLight from '../Images/LogoLight.svg';
import LogoDark from '../Images/LogoDark.svg';

const Logo = ({ darkTheme }) => {
    return (
      <Link to="/">
      <img
        src={darkTheme ? LogoDark : LogoLight}
        alt="Logo company"
      />
      </Link>
    );
  };

export default Logo;

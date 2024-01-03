import React from 'react';
import { Link } from 'react-router-dom';
import LogoLight from '../Images/LogoLight.svg';
import LogoDark from '../Images/LogoDark.svg';
import css from'./Logo.module.css';

const Logo = ({ darkTheme }) => {
    return (
      <Link to="/">
      <img
        src={darkTheme ? LogoDark : LogoLight}
        alt="Logo company"
        className={css.logo}
      />
      </Link>
    );
  };

export default Logo;

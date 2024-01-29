import React from 'react';
import { Link } from 'react-router-dom';
import NewLogoLight from '../Images/NewLogoLight.svg';
import NewLogoDark from '../Images/NewLogoDark.svg';
import css from'./Logo.module.css';

const Logo = ({ darkTheme }) => {
    return (
      <Link to="/">
      <img
        src={darkTheme ? NewLogoDark : NewLogoLight}
        alt="Logo company"
        className={css.logo}
      />
      </Link>
    );
  };

export default Logo;

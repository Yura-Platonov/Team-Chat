import React from 'react';
import { Link } from 'react-router-dom';
import NewLogoLight from '../Images/NewLogoLight.svg';
import NewLogoDark from '../Images/NewLogoDark.svg';
import css from'./Logo.module.css';

const Logo = ({ darkTheme }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
    return (
      <Link to="/" onClick={scrollToTop}>
      <img
        src={darkTheme ? NewLogoDark : NewLogoLight}
        alt="Logo company"
        className={css.logo}
      />
      </Link>
    );
  };

export default Logo;

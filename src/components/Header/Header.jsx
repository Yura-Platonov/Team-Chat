import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import css from './Header.module.css';
import LogoLight from '../Images/LogoLight.svg';
import LogoDark from '../Images/LogoDark.svg';



const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <header>
        <img
          src={darkTheme ? LogoDark : LogoLight}
          alt="Logo company"
        />
      <nav>
        <ul className={css.nav_list}>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Chat rooms</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Personal chat</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Settings</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Rools of the chat</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Privacy Policy</a></li>
        </ul>
      </nav>
      <div className="theme-toggle">
        <label>
          Темная тема переключатель
          <Switch
            onChange={toggleTheme}
            checked={darkTheme}
            onColor="#ffffff"
            offColor="#000000"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>
      </div>
    </header>
  );
};

export default Header;

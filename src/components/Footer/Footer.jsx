import React from 'react';
import css from './Footer.module.css';
import Logo from '../Header/Logo';
import PlayMarket from '../Images/PlayMarket.svg';
import AppStore from '../Images/AppStore.svg';

const Footer = ({ darkTheme }) => {
    return (
    <footer>
      <div className={css.footer_nav}>
       <Logo darkTheme={darkTheme} />
      <nav>
        <ul className={css.nav_list}>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Chat rooms</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Personal chat</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Settings</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Rules of the chat</a></li>
          <li className={css.nav_item}><a href="/" className={css.nav_link}>Privacy Policy</a></li>
        </ul>
      </nav>
      <div>
      <p style={{ margin: '0px', fontSize: '20px', lineHeight: 1.3, color: 'inherit' }}>Download our app</p>
        <ul className={css.footer_list}>
          <li>
            <img
              src={PlayMarket}
              alt="PlayMarket"/>
          </li>
          <li>
            <img
              src={AppStore}
              alt="AppStore"
            />
          </li>
        </ul>
      </div>
      </div>
        <ul className={css.footer_list_text}>
          <li><p style={{ margin: '0px', fontSize: '18px', lineHeight: 1.3, color: 'inherit' }}>©All rights reserved</p></li>
          <li><p style={{ margin: '0px', fontSize: '18px', lineHeight: 1.3, color: 'inherit' }}>Site was created: Cool Team</p></li>
        </ul>
      
    </footer>
  );
};

export default Footer;

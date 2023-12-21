import React from 'react';
import { Link } from 'react-router-dom';
import css from './Footer.module.css';
import Logo from '../Header/Logo';
import PlayMarket from '../Images/PlayMarket.svg';
import PlayMarketHover from '../Images/PlayMarketHover.svg';
import AppStore from '../Images/AppStore.svg';
import AppStoreHover from '../Images/AppStoreHover.svg';

const Footer = ({ darkTheme }) => {
    return (
    <footer>
      <div className={css.footer_nav}>
       <Logo darkTheme={darkTheme} />
      <nav>
        <ul className={css.nav_list}>
        <li className={css.nav_item}><Link to="/" className={css.nav_link}>Chat rooms</Link></li>
          <li className={css.nav_item}><Link to="/PersonalChatPage" className={css.nav_link}>Personal chat</Link></li>
          <li className={css.nav_item}><Link to="/" className={css.nav_link}>Favorites</Link></li>
          <li className={css.nav_item}><Link to="/" className={css.nav_link}>Rules of the chat</Link></li>
          <li className={css.nav_item}><Link to="/PrivacyPolicy" className={css.nav_link}>Privacy Policy</Link></li>
        </ul>
      </nav>
      <div>
      <p style={{ margin: '0px', fontSize: '20px', lineHeight: 1.3, color: 'inherit' }}>Download our app</p>
        <ul className={css.footer_list}>
          <li className={css.footer_item}>
            <img
              src={PlayMarket}
              alt="PlayMarket"
              className={css.footer_img}
              />
              <img
              src={PlayMarketHover}
              alt="PlayMarketHover"
              className={css.footer_imgHover}
              />
          </li>
          <li className={css.footer_item}>
            <img
              src={AppStore}
              alt="AppStore"
              className={css.footer_img}
            />
             <img
              src={AppStoreHover}
              alt="AppStoreHover"
              className={css.footer_imgHover}
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

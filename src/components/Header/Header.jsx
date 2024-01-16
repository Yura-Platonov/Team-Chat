import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import css from './Header.module.css';
import Logo from './Logo';
import UserAvatar from '../Images/defaultAvatar.svg'
import LoginModal from '../Modal/LoginModal';
import { useAuth } from '../LoginForm/AuthContext';
import AvatarModal from '../Modal/AvatarModal';
import { ReactComponent as MobileMenuSVG } from './mobileMenu.svg';

function IconSun() {
  return (
    <svg width="36" height="36" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.5 17C25.5 19.2543 24.6045 21.4163 23.0104 23.0104C21.4163 24.6045 19.2543 25.5 17 25.5C14.7457 25.5 12.5837 24.6045 10.9896 23.0104C9.39553 21.4163 8.5 19.2543 8.5 17C8.5 14.7457 9.39553 12.5837 10.9896 10.9896C12.5837 9.39553 14.7457 8.5 17 8.5C19.2543 8.5 21.4163 9.39553 23.0104 10.9896C24.6045 12.5837 25.5 14.7457 25.5 17Z" fill="#F5FBFF"/>
    <path  d="M17 1.77087C17.2818 1.77087 17.552 1.88282 17.7513 2.08207C17.9506 2.28133 18.0625 2.55158 18.0625 2.83337V4.25004C18.0625 4.53183 17.9506 4.80208 17.7513 5.00134C17.552 5.2006 17.2818 5.31254 17 5.31254C16.7182 5.31254 16.448 5.2006 16.2487 5.00134C16.0494 4.80208 15.9375 4.53183 15.9375 4.25004V2.83337C15.9375 2.55158 16.0494 2.28133 16.2487 2.08207C16.448 1.88282 16.7182 1.77087 17 1.77087ZM6.23191 6.23196C6.43113 6.03299 6.70118 5.92123 6.98274 5.92123C7.26431 5.92123 7.53436 6.03299 7.73358 6.23196L8.29033 6.78729C8.48397 6.98759 8.59119 7.25593 8.5889 7.53452C8.58661 7.8131 8.475 8.07964 8.27809 8.27673C8.08119 8.47382 7.81475 8.58569 7.53617 8.58824C7.25758 8.59079 6.98914 8.48383 6.78866 8.29037L6.23191 7.73362C6.03294 7.53441 5.92118 7.26435 5.92118 6.98279C5.92118 6.70123 6.03294 6.43118 6.23191 6.23196ZM27.7681 6.23196C27.967 6.43118 28.0788 6.70123 28.0788 6.98279C28.0788 7.26435 27.967 7.53441 27.7681 7.73362L27.2113 8.29037C27.0099 8.47805 26.7435 8.58023 26.4683 8.57537C26.193 8.57052 25.9304 8.45901 25.7357 8.26434C25.541 8.06967 25.4295 7.80704 25.4247 7.53178C25.4198 7.25652 25.522 6.99012 25.7097 6.78871L26.2664 6.23196C26.4656 6.03299 26.7357 5.92123 27.0172 5.92123C27.2988 5.92123 27.5689 6.03299 27.7681 6.23196ZM1.77083 17C1.77083 16.7182 1.88277 16.448 2.08203 16.2487C2.28128 16.0495 2.55154 15.9375 2.83333 15.9375H4.24999C4.53179 15.9375 4.80204 16.0495 5.0013 16.2487C5.20055 16.448 5.31249 16.7182 5.31249 17C5.31249 17.2818 5.20055 17.5521 5.0013 17.7513C4.80204 17.9506 4.53179 18.0625 4.24999 18.0625H2.83333C2.55154 18.0625 2.28128 17.9506 2.08203 17.7513C1.88277 17.5521 1.77083 17.2818 1.77083 17ZM28.6875 17C28.6875 16.7182 28.7994 16.448 28.9987 16.2487C29.198 16.0495 29.4682 15.9375 29.75 15.9375H31.1667C31.4485 15.9375 31.7187 16.0495 31.918 16.2487C32.1172 16.448 32.2292 16.7182 32.2292 17C32.2292 17.2818 32.1172 17.5521 31.918 17.7513C31.7187 17.9506 31.4485 18.0625 31.1667 18.0625H29.75C29.4682 18.0625 29.198 17.9506 28.9987 17.7513C28.7994 17.5521 28.6875 17.2818 28.6875 17ZM25.7097 25.7097C25.9089 25.5107 26.1789 25.399 26.4605 25.399C26.7421 25.399 27.0121 25.5107 27.2113 25.7097L27.7681 26.2665C27.8725 26.3637 27.9562 26.481 28.0143 26.6114C28.0723 26.7417 28.1036 26.8824 28.1061 27.0251C28.1086 27.1677 28.0824 27.3094 28.0289 27.4417C27.9755 27.574 27.8959 27.6942 27.795 27.7951C27.6942 27.896 27.574 27.9755 27.4417 28.029C27.3094 28.0824 27.1677 28.1086 27.025 28.1061C26.8823 28.1036 26.7416 28.0724 26.6113 28.0143C26.481 27.9562 26.3637 27.8725 26.2664 27.7681L25.7097 27.2114C25.5107 27.0122 25.3989 26.7421 25.3989 26.4605C25.3989 26.179 25.5107 25.9089 25.7097 25.7097ZM8.29033 25.7097C8.4893 25.9089 8.60106 26.179 8.60106 26.4605C8.60106 26.7421 8.4893 27.0122 8.29033 27.2114L7.73358 27.7681C7.63631 27.8725 7.51901 27.9562 7.38867 28.0143C7.25834 28.0724 7.11765 28.1036 6.97499 28.1061C6.83232 28.1086 6.69061 28.0824 6.55831 28.029C6.42601 27.9755 6.30583 27.896 6.20494 27.7951C6.10405 27.6942 6.02451 27.574 5.97107 27.4417C5.91763 27.3094 5.89139 27.1677 5.89391 27.0251C5.89642 26.8824 5.92765 26.7417 5.98572 26.6114C6.04379 26.481 6.12752 26.3637 6.23191 26.2665L6.78724 25.7097C6.88592 25.611 7.00308 25.5326 7.13203 25.4792C7.26098 25.4258 7.3992 25.3983 7.53879 25.3983C7.67837 25.3983 7.81659 25.4258 7.94554 25.4792C8.0745 25.5326 8.19166 25.611 8.29033 25.7097ZM17 28.6875C17.2818 28.6875 17.552 28.7995 17.7513 28.9987C17.9506 29.198 18.0625 29.4683 18.0625 29.75V31.1667C18.0625 31.4485 17.9506 31.7188 17.7513 31.918C17.552 32.1173 17.2818 32.2292 17 32.2292C16.7182 32.2292 16.448 32.1173 16.2487 31.918C16.0494 31.7188 15.9375 31.4485 15.9375 31.1667V29.75C15.9375 29.4683 16.0494 29.198 16.2487 28.9987C16.448 28.7995 16.7182 28.6875 17 28.6875Z" fill="#F5FBFF"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="36" height="36" viewBox="-5 -5 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.5778 21.7356C20.1175 21.7078 17.7321 20.8847 15.7782 19.3893C13.8243 17.8938 12.4067 15.8063 11.7372 13.4386C11.0677 11.0709 11.1822 8.55018 12.0637 6.25298C12.9452 3.95577 14.5463 2.00544 16.6278 0.693388C15.5761 0.419977 14.494 0.280356 13.4073 0.277832C9.90053 0.277832 6.53741 1.67088 4.05776 4.15053C1.57811 6.63018 0.185059 9.9933 0.185059 13.5001C0.185059 17.0068 1.57811 20.3699 4.05776 22.8496C6.53741 25.3292 9.90053 26.7223 13.4073 26.7223C15.3939 26.7205 17.3538 26.2652 19.1378 25.3913C20.9218 24.5173 22.4828 23.2476 23.7017 21.6789C23.3283 21.7169 22.9532 21.7358 22.5778 21.7356Z" fill="#0F1E28"/>
</svg>
  );
}

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`mobile-menu-container ${isMenuOpen ? 'open' : ''}`}>
      <button onClick={toggleMenu} className={css.mobMenuButton}>
        <MobileMenuSVG/>
        </button>
      {isMenuOpen && (
         <ul className={css.mob_list}>
         <li className={css.nav_item}><Link to="/" className={css.nav_link}>Chat rooms</Link></li>
         <li className={css.nav_item}><Link to="/PersonalChatPage" className={css.nav_link}>Personal chat</Link></li>
         <li className={css.nav_item}><Link to="/" className={css.nav_link}>Settings</Link></li>
         <li className={css.nav_item}><Link to="/RoolsOfTheChat" className={css.nav_link}>Rules of the chat</Link></li>
         <li className={css.nav_item}><Link to="/PrivacyPolicy" className={css.nav_link}>Privacy Policy</Link></li>
       </ul>
      )}
    </div>
  );
};


const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false); 
  const { user } = useAuth();
  // const user_name = localStorage.getItem('user_name');
  const user_avatar = localStorage.getItem('avatar');
  const defaultAvatar = UserAvatar;
  
  
  


  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme'); 
      document.body.classList.remove('light-theme'); 
    } else {
      document.body.classList.add('light-theme'); 
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const toggleLang = () => {
    console.log("change lang")
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };


  return (
    <header>
        <div className={css.mobLogo}>
        <MobileMenu/>
        <Logo darkTheme={darkTheme}/>
        </div>
      <nav>
        <ul className={css.nav_list}>
          <li className={css.nav_item}><Link to="/" className={css.nav_link}>Chat rooms</Link></li>
          <li className={css.nav_item}><Link to="/PersonalChatPage" className={css.nav_link}>Personal chat</Link></li>
          <li className={css.nav_item}><Link to="/" className={css.nav_link}>Settings</Link></li>
          <li className={css.nav_item}><Link to="/RoolsOfTheChat" className={css.nav_link}>Rules of the chat</Link></li>
          <li className={css.nav_item}><Link to="/PrivacyPolicy" className={css.nav_link}>Privacy Policy</Link></li>
        </ul>
      </nav>
      <div className={css.userInfo}>
      <div className={css.avatarCircle}  onClick={user ? openAvatarModal : openLoginModal}>
        <img
          src={user ? user_avatar : defaultAvatar}
          alt={user ? 'User Avatar' : 'Default Avatar'}
          className={css.avatar}
        />
      </div>
      <div>
          <Switch
            className={css.toggle}
            onChange={toggleTheme}
            checked={darkTheme}
            height={40}
            width={80}
            onColor="#0F1E28" // включен - задний фон
            onHandleColor="#F5FBFF" // включен - шарик
            offColor="#F5FBFF" // выключен - задний фон
            offHandleColor="#0F1E28" // выключен -шарик
            uncheckedIcon={false}
            uncheckedHandleIcon={<IconSun/>}
            checkedHandleIcon={<IconMoon />}
            checkedIcon={false}
          />     
      </div>
      <div>
          <Switch
            className={css.toggle}
            onChange={toggleLang}
            checked={false}
            height={40}
            width={80}
            onColor="#0F1E28" // включен - задний фон
            onHandleColor="#F5FBFF" // включен - шарик
            offColor="#F5FBFF" // выключен - задний фон
            offHandleColor="#0F1E28" // выключен -шарик
            uncheckedIcon={false}
            // uncheckedHandleIcon={<IconSun/>}
            // checkedHandleIcon={<IconMoon />}
            checkedIcon={false}
          />     
      </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <AvatarModal isOpen={isAvatarModalOpen} onClose={closeAvatarModal}/>
    </header>
    
  );
};

export default Header;

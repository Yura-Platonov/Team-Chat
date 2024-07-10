import React, { useState }  from 'react';
import Tabs  from 'components/Tabs/Tabs';
import css from './Main.module.css';

function Main() {

  const [showPlusItems, setShowPlusItems] = useState(false);

  const togglePlusItems = () => {
    setShowPlusItems(!showPlusItems);
  };


  return (
    <div className={css.container}>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist <br /> to Coolchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br />Communicate, get good advice and choose!</p>
      </section>
      <Tabs />
      <div className={css.plusButton} onClick={togglePlusItems}>
        {showPlusItems && (
          <>
            <div className={`${css.plusItem} ${css.itemTop}`} >
              Room
            </div>
            <div className={`${css.plusItem} ${css.itemLeft}`} >
             Tab
            </div>
            <div className={`${css.plusItem} ${css.itemDiagonal}`}>
              +
            </div>
          </>
        )}
        +
      </div>
    </div>
  );
}


export default Main;

import React from 'react';
import { ReactComponent as Img1 } from '../../components/Images/RoolsOfTheChat/1.svg';
import { ReactComponent as Img2 } from '../../components/Images/RoolsOfTheChat/2.svg';
import { ReactComponent as Img3 } from '../../components/Images/RoolsOfTheChat/3.svg';
import { ReactComponent as Img4 } from '../../components/Images/RoolsOfTheChat/4.svg';
import { ReactComponent as Img5 } from '../../components/Images/RoolsOfTheChat/5.svg';
import { ReactComponent as Img6 } from '../../components/Images/RoolsOfTheChat/6.svg';
import { ReactComponent as Img7 } from '../../components/Images/RoolsOfTheChat/7.svg';
import { ReactComponent as Img8 } from '../../components/Images/RoolsOfTheChat/8.svg';
import { ReactComponent as Img9 } from '../../components/Images/RoolsOfTheChat/9.svg';
import { ReactComponent as Img10 } from '../../components/Images/RoolsOfTheChat/10.svg';

import css from './RoolsOfTheChat.module.css';

function RoolsOfTheChat() {
    return (
        <div className={css.container}>
            <h2 className={css.title}>Rools of the chat</h2>
            <div className={css.main_container}>
            <ul className={css.list}>
                <li className={css.item}>
                <Img1/>
                    <p>
                    <b>Be polite and respect other users.</b> Avoid rudeness, offensive language and threats. Respect the opinions of others, even if you don't agree with them.
                    </p>
                </li>
                <li className={css.item}>
                <Img2/>
                    <p>
                    <b>Avoid spam and flooding.</b>Do not send many messages at once, do not write unrelated or unnecessary texts.
                    </p>
                </li>
                <li className={css.item}>
                <Img3/>
                    <p>
                    <b>Do not use caps lock or lots of punctuation.</b>It can look like yelling or being overly emotional.
                    </p>
                </li> 
                <li className={css.item}>
                <Img4/>
                    <p>
                    <b>Avoid political and religious discussions unless it is the topic of the chat.</b>Such topics can cause conflicts and misunderstandings.
                    </p>
                </li>
                <li className={css.item}>
                <Img5/>
                    <p>
                    <b>Be careful about privacy.</b>Do not share personal information about yourself or other users.
                    </p>
                </li> 
                <li className={css.item}>
                <Img6/>
                    <p>
                    <b>Do not use offensive or obscene language.</b>Such expressions can offend others and violate the civility of the chat.
                    </p>
                </li> 
                <li className={css.item}>
                <Img7/>
                    <p>
                    <b>Be patient and friendly.</b>Communicate with others as you want to be communicated with.
                    </p>
                </li> 
                <li className={css.item}>
                <Img8/>
                    <p>
                    <b>Do not post unnatural or false information.</b> Avoid spreading myths, deception or false information.
                    </p>
                </li> 
                <li className={css.item}>
                <Img9/>
                    <p>
                    <b>Be careful when using emojis and emoticons.</b>What may look like a joke to you may be perceived as offensive by other users.
                    </p>
                </li> 
                <li className={css.item}>
                <Img10/>
                    <p>
                    <b>If you encounter a conflict situation, please contact a chat administrator or moderator for assistance.</b>Do not try to solve the situation yourself or respond to rudeness with rudeness.
                    </p>
                </li>
                <p className={css.text}>Дотримуючись цих правил, ви сприяєте створенню позитивного та безпечного середовища для всіх учасників веб-чату.</p>
            </ul>
            
                
            

            </div>
            </div>
      );
}

export default RoolsOfTheChat;
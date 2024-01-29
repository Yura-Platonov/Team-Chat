import React from 'react';
import { ReactComponent as PrivacyPolicyImg } from '../../components/Images/PrivacyPolicyImg.svg';

import css from './PrivacyPolicy.module.css';

function PrivacyPolicy() {
    return (
        <div className={css.container}>
            <h2 className={css.title}>Privacy policy</h2>
            <div className={css.main_container}>
            <div>
                <p>This privacy policy sets out the obligations and rules regarding the collection, use and disclosure of user’s personal information when communicating on Coolchat. We take the privacy of our users' information seriously and are committed to protecting their privacy.</p>
                <ol className={css.list}>
                    <li className={css.item}>Collection and Use of Information: We may collect personal information such as name and email address only with users' permission to provide better communication and provide personalized services. We use this information only for the purpose of improving the quality of our service and providing users with appropriate answers to their questions.</li>
                    <li className={css.item}>Information Security: We take all possible security measures to protect the personal information of our users from unauthorized access, alteration, disclosure or destruction. Our systems are regularly updated and checked for possible threats.</li>
                    <li className={css.item}>Disclosure of information to third parties: We do not share users' personal information with third parties without their consent, except as required by law.</li>
                    <li className={css.item}>Use of cookies: Our Chat for communication may use cookies and other technologies to collect information and improve the user experience. Users have the option to disable cookies in their web browser settings, but this may affect the functionality of Coolchat.</li>
                    <li className={css.item}>Changes to the Privacy Policy: We may periodically update this Privacy Policy to reflect changes in legal requirements or information practices. Changes take effect from the moment of their public posting on this page.</li>
                </ol>
                <p>This privacy policy is for your protection and remains binding on all Coolchat users. If you have any questions about our privacy policy, please contact us using the contact information provided on our website.</p>
            </div>
            <div className={css.imgContainer}>
                <PrivacyPolicyImg/>

            </div>
            </div>
        </div>
      );
}

export default PrivacyPolicy;
import React, { useState } from 'react';
import CustomModal from './CustomModal';
import css from './CreateTabModal.module.css';
import * as Icons from '@mui/icons-material';

const iconList = [
  { name: 'Aeroplane', component: Icons.Flight },
  { name: 'ATV', component: Icons.Toys },
  { name: 'Audio Input XLR', component: Icons.SettingsInputComponent },
  { name: 'Auto Fix', component: Icons.Build },
  // { name: 'Badminton', component: Icons.SportsBadminton },
  { name: 'Bandage', component: Icons.LocalHospital },
  { name: 'Basketball', component: Icons.SportsBasketball },
  { name: 'Battery Heart Variant', component: Icons.Favorite },
  // { name: 'Bomb', component: Icons.Bomb },
  { name: 'Briefcase', component: Icons.Work },
  { name: 'Briefcase Variant', component: Icons.WorkOutline },
  { name: 'Bullhorn', component: Icons.Campaign },
  { name: 'Bus', component: Icons.DirectionsBus },
  { name: 'Cart', component: Icons.ShoppingCart },
  { name: 'Cellphone Basic', component: Icons.PhoneAndroid },
  // { name: 'Compost', component: Icons.Eco },
  { name: 'Controller', component: Icons.Gamepad },
  { name: 'Creation Outline', component: Icons.Create },
  { name: 'Cross Outline', component: Icons.Add },
  { name: 'Crown Circle', component: Icons.EmojiEvents },
  { name: 'Crystal Ball', component: Icons.SportsEsports },
  { name: 'Currency BTC', component: Icons.CurrencyBitcoin },
  { name: 'Death Star Variant', component: Icons.Brightness2 },
  { name: 'Diamond Stone', component: Icons.Diamond },
  { name: 'Dice Multiple', component: Icons.Casino },
  { name: 'DNA', component: Icons.Biotech },
  { name: 'Dolphin', component: Icons.Waves },
  { name: 'Dog', component: Icons.Pets },
  { name: 'Cat', component: Icons.Pets },
  { name: 'Duck', component: Icons.Adjust },
  { name: 'Egg Fried', component: Icons.Egg },
  { name: 'Ethereum', component: Icons.CurrencyBitcoin },
  { name: 'Fingerprint', component: Icons.Fingerprint },
  { name: 'Fire', component: Icons.Whatshot },
  { name: 'Food Turkey', component: Icons.Restaurant },
  { name: 'Ghost', component: Icons.SportsEsports },
  // { name: 'Halloween', component: Icons.Pumpkin },
  { name: 'Hiking', component: Icons.Hiking },
  // { name: 'Horse Variant', component: Icons.Horse },
  { name: 'Noodles', component: Icons.RamenDining },
  { name: 'Phone Classic', component: Icons.Phone },
  { name: 'Police Badge', component: Icons.LocalPolice },
  { name: 'Puzzle', component: Icons.Extension },
  { name: 'Robot', component: Icons.SmartToy },
  { name: 'Robot Love', component: Icons.Favorite },
  { name: 'Skateboarding', component: Icons.Skateboarding },
  { name: 'Tag Multiple', component: Icons.Label },
  { name: 'Web', component: Icons.Language },
  // { name: 'Yin Yang', component: Icons.Acupuncture },
  { name: 'Trophy', component: Icons.EmojiEvents }
];

const CreateTabModal = ({
  isOpen,
  onClose,
   
}) => {

  const [selectedIcon, setSelectedIcon] = useState('');

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.createRoomContainer}>
        <h2 className={css.title}>Add a new Tab</h2>
        <label className={css.text}>
          Name of the chat Tab*
          <input
            className={css.input}
            type="text"
            placeholder="Tab Name"
            // value={roomName}
            // onChange={(e) => setRoomName(e.target.value)}
          />
        </label>
        <div>
        <label className={css.text1}>Choose an icon for the Tab*</label>
          <div className={css.iconContainer}>
            {iconList.map((icon) => {
              const IconComponent = icon.component;
              return (
                <div
                  key={icon.name}
                  className={`${css.iconWrapper} ${selectedIcon === icon.name ? css.selected : ''}`}
                  onClick={() => setSelectedIcon(icon.name)}
                >
                  <IconComponent />
                  {/* <span className={css.iconLabel}>{icon.name}</span> */}
                </div>
              );
            })}
          </div>
        </div>
        <div className={css.center}>
          {/* <button className={css.button} onClick={handleCreateRoom}> */}
          <button className={css.button} >

            Approve
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateTabModal;

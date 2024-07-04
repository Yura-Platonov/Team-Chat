import * as Icons from '@mui/icons-material';
import {Flight}  from '@mui/icons-material';

export const icons = {
  Aeroplane: { name: 'ATV', component: Flight },
};

const iconList = [
  { name: 'Aeroplane', component: Icons.Flight },
  { Aeroplane: { name: 'ATV', component: Flight }},
  { name: 'ATV', component: Icons.Toys },
  { name: 'Audio Input XLR', component: Icons.SettingsInputComponent },
  { name: 'Auto Fix', component: Icons.Build },
  { name: 'Bandage', component: Icons.LocalHospital },
  { name: 'Basketball', component: Icons.SportsBasketball },
  { name: 'Battery Heart Variant', component: Icons.Favorite },
  { name: 'Briefcase', component: Icons.Work },
  { name: 'Briefcase Variant', component: Icons.WorkOutline },
  { name: 'Bullhorn', component: Icons.Campaign },
  { name: 'Bus', component: Icons.DirectionsBus },
  { name: 'Cart', component: Icons.ShoppingCart },
  { name: 'Cellphone Basic', component: Icons.PhoneAndroid },
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
  { name: 'Hiking', component: Icons.Hiking },
  { name: 'Noodles', component: Icons.RamenDining },
  { name: 'Phone Classic', component: Icons.Phone },
  { name: 'Police Badge', component: Icons.LocalPolice },
  { name: 'Puzzle', component: Icons.Extension },
  { name: 'Robot', component: Icons.SmartToy },
  { name: 'Robot Love', component: Icons.Favorite },
  { name: 'Skateboarding', component: Icons.Skateboarding },
  { name: 'Tag Multiple', component: Icons.Label },
  { name: 'Web', component: Icons.Language },
  { name: 'Trophy', component: Icons.EmojiEvents }
];

const tabsIcons = iconList.reduce((acc, icon) => {
  acc[icon.name] = icon.component;
  return acc;
}, {});

export default tabsIcons;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import Select from 'react-select';

// Modal.setAppElement('#root');

// const CustomOption = ({ innerProps, label }) => (
//   <div {...innerProps}>
//     {label}
//   </div>
// );

// function CreateRoom() {
//   const [roomName, setRoomName] = useState('');
//   const [roomImage, setRoomImage] = useState('');
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [imageOptions, setImageOptions] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     axios.get('http://35.228.45.65:8800/images/Home')
//       .then((response) => {
//         setImageOptions(response.data.map((image) => ({
//           value: image.images,
//           label: (
//             <div>
//               <img src={image.images} alt={image.image_room} width="50" height="50" />
//               {image.image_room}
//             </div>
//           ),
//         })));
//       })
//       .catch((error) => {
//         console.error('Ошибка при загрузке изображений:', error);
//       });
//   }, []);

//   const handleCreateRoom = () => {
//     if (!roomName || !roomImage) {
//       alert('Пожалуйста, заполните все поля');
//       return;
//     } else if (!selectedOption) {
//       alert('Пожалуйста, выберите изображение');
//       return;
//     }

//     axios
//       .post('http://35.228.45.65:8800/rooms/', { name_room: roomName, image_room: roomImage })
//       .then((response) => {
//         console.log('Комната создана:', response.data);
//         setRoomName('');
//         setRoomImage('');
//         setSelectedOption(null);
//         setIsModalOpen(false);
//       })
//       .catch((error) => {
//         console.error('Ошибка при создании комнаты:', error);
//       });
//   };

//   return (
//     <div>
//       <h2>Create a Room</h2>
//       <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//       >
//         <h2>Create a Room</h2>
//         <input
//           type="text"
//           placeholder="Room Name"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <Select
//           value={selectedOption}
//           onChange={(option) => {
//             setSelectedOption(option);
//             setRoomImage(option.value);
//           }}
//           options={imageOptions}
//           placeholder="Select an Image"
//           components={{
//             Option: CustomOption, // Используем свой компонент Option
//           }}
//         />
//         <button onClick={handleCreateRoom}>
//           Create Room
//         </button>
//       </Modal>
//     </div>
//   );
// }

// export default CreateRoom;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';

import { useAuth } from '../LoginForm/AuthContext'; 

Modal.setAppElement('#root');

const CustomOption = ({ innerProps, label }) => (
  <div {...innerProps}>
    {label}
  </div>
);

function CreateRoom() {
  const { authToken } = useAuth(); // Get the authentication token using the useAuth hook
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://35.228.45.65:8800/images/Home')
      .then((response) => {
        setImageOptions(response.data.map((image) => ({
          value: image.images,
          label: (
            <div>
              <img src={image.images} alt={image.image_room} width="50" height="50" />
              {image.image_room}
            </div>
          ),
        })));
      })
      .catch((error) => {
        console.error('Ошибка при загрузке изображений:', error);
      });
  }, []);

  
  console.log('authToken:', authToken);
  // console.log('user:', user);

  

  const handleCreateRoom = () => {
    console.log('authToken:', authToken);
    if (!authToken) {
      alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      // You can redirect the user to the login page or show a login modal here.
      return;
    }
    
    if (!roomName || !roomImage) {
      alert('Пожалуйста, заполните все поля');
      return;
    } else if (!selectedOption) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    axios
      .post('http://35.228.45.65:8800/rooms/', { name_room: roomName, image_room: roomImage })
      .then((response) => {
        console.log('Комната создана:', response.data);
        setRoomName('');
        setRoomImage('');
        setSelectedOption(null);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Ошибка при создании комнаты:', error);
      });
  };

  return (
    <div>
      <h2>Create a Room</h2>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <h2>Create a Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Select
          value={selectedOption}
          onChange={(option) => {
            setSelectedOption(option);
            setRoomImage(option.value);
          }}
          options={imageOptions}
          placeholder="Select an Image"
          components={{
            Option: CustomOption, // Используем свой компонент Option
          }}
        />
        <button onClick={handleCreateRoom}>
          Create Room
        </button>
      </Modal>
    </div>
  );
}

export default CreateRoom;

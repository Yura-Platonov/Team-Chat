import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Импортируем библиотеку модальных окон

function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [imageOptions, setImageOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние видимости модального окна

  useEffect(() => {
    // axios.get('http://35.228.45.65:8800/images')
    //   .then((response) => {
    //     setImageOptions(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Ошибка при загрузке изображений:', error);
    //   });
  }, []);

  const handleCreateRoom = () => {
    if (!roomName || !roomImage) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    axios
      .post('http://35.228.45.65:8800/rooms/', { name_room: roomName, image_room: roomImage })
      .then((response) => {
        console.log('Комната создана:', response.data);
        setRoomName(''); // Очищаем поле названия комнаты
        setRoomImage(''); // Очищаем поле выбранного изображения
        setIsModalOpen(false); // Закрываем модальное окно
        // Обновите список комнат, если это необходимо
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
        // Добавьте стили для модального окна
      >
        <h2>Create a Room</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <select
          value={roomImage}
          onChange={(e) => setRoomImage(e.target.value)}
        >
          <option value="" disabled>Select an Image</option>
          {imageOptions.map((image) => (
            <option key={image.id} value={image.url}>
              {image.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateRoom}>
          Create Room
        </button>
      </Modal>
    </div>
  );
}

export default CreateRoom;
import React from 'react';
import CustomModal from './CustomModal';
import css from './CreateRoomModal.module.css';

const CreateRoomModal = ({
  isOpen,
  onClose,
  roomName,
  setRoomName,
  roomImage,
  setRoomImage,
  selectedOption,
  setSelectedOption,
  imageOptions,
  activeCardIndex,
  setActiveCardIndex,
  handleCreateRoom,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.createRoomContainer}>
        <h2 className={css.title}>Add a new chat room</h2>
        <label className={css.text}>
          Name of the chat room*
          <input
            className={css.input}
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </label>
        <div>
          <label className={css.text1}>Choose a photo of the room*</label>
          <div className={css.roomImgContainer}>
            {imageOptions.map((roomImg, index) => (
              <div
                key={index}
                className={`${css.roomImgCard} ${activeCardIndex === index ? css.active : ''}`}
                onClick={() => {
                  setActiveCardIndex(index);
                  setSelectedOption(roomImg);
                  setRoomImage(roomImg.value);
                }}
              >
                <img src={roomImg.value} alt={roomImg.label} className={css.roomImg} />
              </div>
            ))}
          </div>
        </div>
        <div className={css.center}>
          <button className={css.button} onClick={handleCreateRoom}>
            Approve
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateRoomModal;

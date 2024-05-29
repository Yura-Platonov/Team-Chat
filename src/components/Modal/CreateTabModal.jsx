import React from 'react';
import CustomModal from './CustomModal';
import css from './CreateTabModal.module.css';

const CreateTabModal = ({
  isOpen,
  onClose,
   
}) => {


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
          <label className={css.text1}>Choose a icon of the Tab*</label>
          {/* <div className={css.roomImgContainer}>
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
          </div> */}
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

// import React, { useState } from 'react';
// import CustomModal from './CustomModal';
// import css from './CreateRoomModal.module.css';
// import { ReactComponent as AddPhotoYourRoomSVG } from '../Images/AddPhotoYourRoom.svg';

// const CreateRoomModal = ({
//   isOpen,
//   onClose,
//   roomName,
//   setRoomName,
//   roomImage,
//   setRoomImage,
//   selectedOption,
//   setSelectedOption,
//   imageOptions,
//   activeCardIndex,
//   setActiveCardIndex,
//   handleCreateRoom,
//   handleFileChange,
//   isSecretRoom,
//   setIsSecretRoom,
// }) => {
//   const [selectedImg, setSelectedImg] = useState('');

//   return (
//     <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
//       <div className={css.createRoomContainer}>
//         <h2 className={css.title}>Add a new chat room</h2>
//         <label className={css.text}>
//           Name of the chat room*
//           <input
//             className={css.input}
//             type="text"
//             placeholder="Room Name"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//           />
//         </label>
//         <div>
//           <label className={css.text1}>Choose a photo of the room*</label>
//           <div className={css.roomImgContainer}>
//             <div
//               className={`${css.roomImgCard} ${activeCardIndex === -1 ? css.active : ''}`}
//               onClick={() => {
//                 setActiveCardIndex(-1);
//                 setSelectedOption(null);
//                 setRoomImage(null);
//                 setSelectedImg('');
//               }}
//             >
//               {!selectedImg && (
//                 <label className={css.uploadLabel}>
//                   <AddPhotoYourRoomSVG className={css.addPhotoIcon} />
//                   <div className={css.uploadOverlay}>Add a photo</div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className={css.fileInput}
//                     onChange={(e) => {
//                       handleFileChange(e);
//                       setSelectedImg(e.target.value);
//                     }}
//                   />
//                 </label>
//               )}
//               {selectedImg && (
//                 <img src={selectedImg} alt="Selected Room" className={css.roomImg} />
//               )}
//             </div>
//             {imageOptions.map((roomImg, index) => (
//               <div
//                 key={index}
//                 className={`${css.roomImgCard} ${activeCardIndex === index ? css.active : ''}`}
//                 onClick={() => {
//                   setActiveCardIndex(index);
//                   setSelectedOption(roomImg);                  
//                 }}
//               >
//                 <img src={roomImg.value} alt={roomImg.label} className={css.roomImg} />
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className={css.secretRoomContainer}>
//           <label className={css.secretRoomLabel}>
//             Secret Room
//             <input
//               type="checkbox"
//               checked={isSecretRoom}
//               onChange={(e) => setIsSecretRoom(e.target.checked)}
//             />
//           </label>
//         </div>
//         <div className={css.center}>
//           <button className={css.button} onClick={handleCreateRoom}>
//             Approve
//           </button>
//         </div>
//       </div>
//     </CustomModal>
//   );
// };

// export default CreateRoomModal;

import React, { useState } from 'react';
import CustomModal from './CustomModal';
import css from './CreateRoomModal.module.css';
import { ReactComponent as AddPhotoYourRoomSVG } from '../Images/AddPhotoYourRoom.svg';

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
  isSecretRoom,
  setIsSecretRoom,
}) => {
  const [selectedImg, setSelectedImg] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result); 
      };
      reader.readAsDataURL(file); 
      setRoomImage(file); 
      setSelectedOption(null); 
      setActiveCardIndex(-1); 
    }
  };

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
            <div
              className={`${css.roomImgCard} ${activeCardIndex === -1 ? css.active : ''}`}
              onClick={() => {
                setActiveCardIndex(-1);
                setSelectedOption(null);
                setRoomImage(null);
                setSelectedImg(null); 
              }}
            >
              {!selectedImg && (
                <label className={css.uploadLabel}>
                  <AddPhotoYourRoomSVG className={css.addPhotoIcon} />
                  <div className={css.uploadOverlay}>Add a photo</div>
                  <input
                    type="file"
                    accept="image/*"
                    className={css.fileInput}
                    onChange={handleFileChange}
                  />
                </label>
              )}
              {selectedImg && (
                <img src={selectedImg} alt="Selected Room" className={css.roomImg} />
              )}
            </div>
            {imageOptions.map((roomImg, index) => (
              <div
                key={index}
                className={`${css.roomImgCard} ${activeCardIndex === index ? css.active : ''}`}
                onClick={() => {
                  setActiveCardIndex(index);
                  setSelectedOption(roomImg);
                  setRoomImage(null);
                  // setSelectedImg(roomImg.value);
                }}
              >
                <img src={roomImg.value} alt={roomImg.label} className={css.roomImg} />
              </div>
            ))}
          </div>
        </div>
        <div className={css.secretRoomContainer}>
          <label className={css.secretRoomLabel}>
            Secret Room
            <input
              type="checkbox"
              checked={isSecretRoom}
              onChange={(e) => setIsSecretRoom(e.target.checked)}
            />
          </label>
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

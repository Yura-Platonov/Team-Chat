// import React, { useState } from 'react';
// import CustomModal from './CustomModal';
// import css from './CreateRoomModal.module.css';
// import { ReactComponent as AddPhotoYourRoomSVG } from '../Images/AddPhotoYourRoom.svg';
// import { ReactComponent as MakeSecretRoomSVG } from '../Images/MakeSecretRoom.svg';

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
//   isSecretRoom,
//   setIsSecretRoom,
// }) => {
//   const [selectedImg, setSelectedImg] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImg(reader.result); 
//       };
//       reader.readAsDataURL(file); 
//       setRoomImage(file); 
//       setSelectedOption(null); 
//       setActiveCardIndex(-1); 
//     }
//   };

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
//         <div className={css.secretRoomContainer}>
//           <label className={css.secretRoomLabel}>
//            <input
//               type="checkbox"
//               checked={isSecretRoom}
//               onChange={(e) => setIsSecretRoom(e.target.checked)}
//             />
//              Make a secret room
//              <MakeSecretRoomSVG/>
//           </label>
//         </div>
//         <div className={css.flexContainer}>
//           <label className={css.titleDescription}>
//             Description
//           <input
//             className={css.inputDescription}
//             type="text"
//             placeholder="Write a short description of the room"
//             // value={roomDescription}
//             // onChange={(e) => setRoomDescription(e.target.value)}
//           />
//           </label>


//           <div className={css.roomImgContainer}>
//             <div
//               className={`${css.roomImgCard} ${activeCardIndex === -1 ? css.active : ''}`}
//               onClick={() => {
//                 setActiveCardIndex(-1);
//                 setSelectedOption(null);
//                 setRoomImage(null);
//                 setSelectedImg(null); 
//               }}
//             >
//               {!selectedImg && (
//                 <label className={css.uploadLabel}>
//                   <AddPhotoYourRoomSVG className={css.addPhotoIcon} />
//                   <p className={css.uploadOverlay}>Add a photo</p>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className={css.fileInput}
//                     onChange={handleFileChange}
//                   />
//                 </label>
//               )}
//               {selectedImg && (
//                 <img src={selectedImg} alt="Selected Room" className={css.roomImg} />
//               )}
//             </div>
//             {/* {imageOptions.map((roomImg, index) => (
//               <div
//                 key={index}
//                 className={`${css.roomImgCard} ${activeCardIndex === index ? css.active : ''}`}
//                 onClick={() => {
//                   setActiveCardIndex(index);
//                   setSelectedOption(roomImg);
//                   setRoomImage(null);
//                   // setSelectedImg(roomImg.value);
//                 }}
//               >
//                 <img src={roomImg.value} alt={roomImg.label} className={css.roomImg} />
//               </div>
//             ))} */}
//           </div>
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



import React, { useState} from 'react';
import axios from 'axios';
import css from './CreateRoomModal.module.css';
import { ReactComponent as AddPhotoYourRoomSVG } from '../Images/AddPhotoYourRoom.svg';
import { ReactComponent as MakeSecretRoomSVG } from '../Images/MakeSecretRoom.svg';
import { useAuth } from '../LoginForm/AuthContext';
import CustomModal from './CustomModal';
import useLoginModal from '../Hooks/useLoginModal';
import VerificationUserModal from 'components/Modal/VerificationUserModal';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
  const { authToken } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  // const [imageOptions, setImageOptions] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isSecretRoom, setIsSecretRoom] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isVerificationUserModalOpen, setIsVerificationUserModalOpen] = useState(false);

  const { isLoginModalOpen, openLoginModal, closeLoginModal, handleRegistrationSuccess, showVerificationModal, setShowVerificationModal } = useLoginModal();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const openVerificationUserModal = () => {
    setIsVerificationUserModalOpen(true);
  };

  const closeVerificationUserModal = (e) => {
    e.stopPropagation();
    setIsVerificationUserModalOpen(false);
  };

  // useEffect(() => {
  //   axios.get(`${apiBaseUrl}/api/images/Home`)
  //     .then((response) => {
  //       setImageOptions(response.data.map((image) => ({
  //         value: image.images,
  //         label: (
  //           <div>
  //             <img src={image.images} alt={image.image_room} width="50" height="50" />
  //             {image.image_room}
  //           </div>
  //         ),
  //       })));
  //     })
  //     .catch((error) => {
  //       console.error('Error loading images:', error);
  //     });
  // }, [apiBaseUrl]);

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

  const handleCreateRoom = () => {
    if (!authToken) {
      openLoginModal();
      return;
    }

    if (!roomName || roomName.trim() === '') {
      alert('Please provide the room name.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    const formData = new FormData();
    formData.append('name_room', roomName);
    if (roomImage) {
      formData.append('file', roomImage);
    }

    axios
      .get(`${apiBaseUrl}/api/users/me/`, { headers })
      .then((response) => {
        const isVerified = response.data.verified;

        if (isVerified) {
          const url = roomImage ? `${apiBaseUrl}/api/rooms/v2?secret=${isSecretRoom}` : `${apiBaseUrl}/api/rooms/`;
          const requestData = roomImage ? formData : { name_room: roomName, image_room: selectedOption ? selectedOption.value : null, };
          console.log(requestData);

          axios
            .post(url, requestData, { headers })
            .then((response) => {
              console.log('Room created:', response.data);
              setRoomName('');
              setRoomImage(null);
              setSelectedOption(null);
              setIsSecretRoom(false);
              onRoomCreated(response.data);
              onClose();
            })
            .catch((error) => {
              console.error('Error creating room:', error);
            });
        } else {
          openVerificationUserModal();
        }
      })
      .catch((error) => {
        console.error('Error checking user verification:', error);
      });
  };

  return (
    <>
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
        <div className={css.secretRoomContainer}>
          <label className={css.secretRoomLabel}>
           <input
              type="checkbox"
              checked={isSecretRoom}
              onChange={(e) => setIsSecretRoom(e.target.checked)}
            />
             Make a secret room
             <MakeSecretRoomSVG/>
          </label>
        </div>
        <div className={css.flexContainer}>
          <label className={css.titleDescription}>
            Description
          <input
            className={css.inputDescription}
            type="text"
            placeholder="Write a short description of the room"
            // value={roomDescription}
            // onChange={(e) => setRoomDescription(e.target.value)}
          />
          </label>

          <div className={css.roomImgContainer}>
            <div className={`${css.roomImgCard} ${activeCardIndex === -1 ? css.active : ''}`}
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
                  <p className={css.uploadOverlay}>Add a photo</p>
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
          </div>
        </div>
      </div>
          <div className={css.center}>
          <button className={css.button} onClick={handleCreateRoom}>
            Approve
          </button>
        </div>
      </CustomModal>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess} />
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      <VerificationUserModal isOpen={isVerificationUserModalOpen} onClose={closeVerificationUserModal} />
    </>
  );
};

export default CreateRoomModal;

import React from 'react';

import css from './Home.module.css';

const Home = () => {
  return (
    <div>
      <main>
        <div className="text-main">
          <h1 className="text-left-main">Welcome to the Teamchat</h1>
          <p className="text-left-main">
            Chat about a wide variety of tourist equipment. <br />
            Communicate, get good advice and choose!
          </p>
        </div>
      </main>
      <div className="chats">
        <h2 className="mb-5">Choose room for communication</h2>
        <div className="row gap gy-1 d-flex justify-content-start">
          <button className="btn col-6 col-md-4 col-xl-3 chat-home">
            <a href="common-chat.html" target="_blank">
              <div className="img-chat chat1">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Foto%20tent_room1_DES.png"
                  className="img-fluid mx-auto d-block"
                  alt="Tents, awnings, canopies"
                />
                <p>Tents, awnings, canopies</p>
              </div>
              <div className="row d-flex align-items-center justify-content-between chathome-icon">
                <div className="col">
                  <img
                    src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                    className="img-fluid d-block"
                    alt="icon people"
                  />
                </div>
                <div className="col">
                  <img
                    src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                    className="img-fluid float-end"
                    alt="icon people online"
                  />
                </div>
              </div>
            </a>
          </button>
          <button className="btn col-6 col-md-4 col-xl-3 chat-home">
            <div className="img-chat chat2">
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Foto%20backpack_room2_DES.png"
                className="img-fluid mx-auto d-block"
                alt="Backpacks, clothes, shoes"
              />
              <p>Backpacks, clothes, shoes</p>
            </div>
            <div className="row d-flex justify-content-between align-items-center chathome-icon">
              <div className="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                  className="img-fluid d-block"
                  alt="icon people"
                />
              </div>
              <div className="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                  className="img-fluid float-end"
                  alt="icon people online"
                />
              </div>
            </div>
          </button>
          <button class="btn col-6 col-md-4 col-xl-3 chat-home">
            <div class="img-chat chat3">
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Foto%20bicycle_room3_DES.png"
                class="img-fluid mx-auto d-block"
                alt="Bicycles and all for them"
              />
              <p>Bicycles and all for them</p>
            </div>
            <div class="row d-flex align-items-center justify-content-between chathome-icon">
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                  class="img-fluid d-block"
                  alt="icon people"
                />
              </div>
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                  class="img-fluid float-end"
                  alt="icon people online"
                />
              </div>
            </div>
          </button>
          <button class="btn col-6 col-md-4 col-xl-3 chat-home">
            <div class="img-chat chat4">
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Foto%20fishing_room4_DES.png"
                class="img-fluid mx-auto d-block"
                alt="Everything for fishing"
              />
              <p>Everything for fishing</p>
            </div>
            <div class="row d-flex align-items-center justify-content-between chathome-icon">
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                  class="img-fluid d-block"
                  alt="icon people"
                />
              </div>
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                  class="img-fluid float-end"
                  alt="icon people online"
                />
              </div>
            </div>
          </button>
          <button class="btn col-6 col-md-4 col-xl-3 chat-home">
            <div class="img-chat chat5">
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Foto%20furniture_room5_DES.png"
                class="img-fluid mx-auto d-block"
                alt="Tourist furniture and tableware"
              />
              <p>Tourist furniture and tableware</p>
            </div>
            <div class="row d-flex align-items-center justify-content-between chathome-icon">
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                  class="img-fluid d-block"
                  alt="icon people"
                />
              </div>
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                  class="img-fluid float-end"
                  alt="icon people online"
                />
              </div>
            </div>
          </button>
          <button class="btn col-6 col-md-4 col-xl-3 chat-home">
            <div class="img-chat chat6">
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Foto%20Plus/Foto%20ADD_room6_DES_light.jpg"
                class="img-fluid mx-auto d-block"
                alt="Tourist furniture and tableware"
              />
              <img
                src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20add_light%20tema_DES.svg"
                class="img-fluid mx-auto add d-block"
                alt="icon add"
              />

              <p>Add room</p>
            </div>
            <div class="row d-flex align-items-center justify-content-between chathome-icon">
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people_DES.svg"
                  class="img-fluid d-block"
                  alt="icon people"
                />
              </div>
              <div class="col">
                <img
                  src="https://tygjaceleczftbswxxei.supabase.co/storage/v1/object/public/image_bucket/Content%20Home%20page/Desktop/Icon%20people%20online_DES.svg"
                  class="img-fluid float-end"
                  alt="icon people online"
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

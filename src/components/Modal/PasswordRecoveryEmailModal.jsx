import React, { useState } from 'react';
import CustomModal from './CustomModal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import css from './PasswordRecoveryEmailModal.module.css';
import PasswordRecoveryEmailModalSend from './PasswordRecoveryEmailModalSend';

const PasswordRecoveryEmailModal = ({ isOpen, onClose }) => {
  const [requestSent, setRequestSent] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string()
      .test('is-valid-email', 'Please input correct email', value => {
        return (
          value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
        );
      })
      .required('Email is required'),
  });

  const handleModalClose = () => {
    onClose();
    setRequestSent(false);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.modalContainer}>
        <h2 className={css.title}>Password recovery</h2>
        <p className={css.text1}>Enter your email address below and we will send you an email to reset your password</p>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post('https://cool-chat.club/api/password/request/', {
                email: values.email
              });
              console.log('Password recovery request sent successfully:', response.data);
              setRequestSent(true);
            } catch (error) {
              console.error('Error during password recovery request:', error.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <label className={css.text}>
                E-mail
                <Field
                  className={`${css.input} ${touched.email && errors.email ? css.isInvalid : touched.email ? css.isValid : ''}`}
                  type="text"
                  name="email"
                  autoComplete="email"
                  placeholder="Indigo@gmail.com"
                />
                <ErrorMessage name="email" component="div" className={css.error} />
              </label>

              <div className={css.center}>
                <button type="submit" className={css.button}>
                  Send
                </button>
              </div>
              {requestSent && <PasswordRecoveryEmailModalSend isOpen={true} email={values.email} onClose={handleModalClose} />}

            </Form>
          )}
        </Formik>
      </div>
    </CustomModal>
  );
};

export default PasswordRecoveryEmailModal;

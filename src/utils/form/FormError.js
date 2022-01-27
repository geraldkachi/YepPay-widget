import React from 'react';
import PropTypes from 'prop-types';

import formikPropTypes from './formikPropTypes';

const FormError = ({ formik, inputName }) => {
  if (formik.touched[inputName] && formik.errors[inputName]) {
    const formError =
      typeof formik.errors[inputName] === 'object' // check for arrays
        ? formik.errors[inputName][0]
        : formik.errors[inputName];
    return (
      <p style={{ fontSize: '12px', color: 'red', marginTop: '5px' }}>
        {formError}
      </p>
    );
  }
  return <p />;
};

FormError.propTypes = {
  formik: PropTypes.shape(formikPropTypes).isRequired,
  inputName: PropTypes.string.isRequired,
};

export default FormError;

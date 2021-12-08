import React from 'react';
import PropTypes from 'prop-types';

const SelectCheckmark = ({ textContent, cardType }) => {
  return (
    <label className="paymentcheck">
      <span className="existing-card-type">
        {textContent}
        <img src={cardType} alt="card" />
      </span>
      <input type="checkbox" checked/>
      <span className="checkmark"></span>
    </label>
  );
}

export default SelectCheckmark;

SelectCheckmark.propTypes = {
  textContent: PropTypes.string,
  cardType: PropTypes.string
};
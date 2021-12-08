import React from 'react';

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
